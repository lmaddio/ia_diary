"use client";

import { useState, useMemo } from "react";
import { Check, Save, AlertCircle } from "lucide-react";
import { DiaryEntryInput } from "@/types";
import { content } from "@/content/text";
import { toISODateString } from "@/lib/utils";
import { Button, Input, Textarea, MoodSelector } from "@/components/ui";

interface DiaryFormProps {
  onSubmit: (entry: DiaryEntryInput) => void;
  initialData?: Partial<DiaryEntryInput>;
  isLoading?: boolean;
}

interface FormErrors {
  date?: string;
  sleepHours?: string;
  workHours?: string;
  outdoorHours?: string;
  totalHours?: string;
}

// Store string values for number inputs to allow empty fields
interface HourInputs {
  sleepHours: string;
  workHours: string;
  outdoorHours: string;
}

const getDefaultHourInputs = (initialData?: Partial<DiaryEntryInput>): HourInputs => ({
  sleepHours: initialData?.sleepHours?.toString() ?? "7",
  workHours: initialData?.workHours?.toString() ?? "8",
  outdoorHours: initialData?.outdoorHours?.toString() ?? "0",
});

const getDefaultFormData = (initialData?: Partial<DiaryEntryInput>): Omit<DiaryEntryInput, 'sleepHours' | 'workHours' | 'outdoorHours'> & { mood: 1 | 2 | 3 | 4 | 5 } => ({
  date: initialData?.date || toISODateString(),
  mood: initialData?.mood || 3,
  meals: initialData?.meals || "",
  activities: initialData?.activities || "",
  notes: initialData?.notes || "",
});

// Parse string to integer, returns NaN for empty/invalid
const parseHours = (value: string): number => {
  if (value.trim() === "") return NaN;
  const num = parseInt(value, 10);
  return num;
};

export default function DiaryForm({ onSubmit, initialData, isLoading: externalLoading }: DiaryFormProps) {
  const { form } = content.diary;
  const [isSaving, setIsSaving] = useState(false);
  const [showSaved, setShowSaved] = useState(false);
  const [formData, setFormData] = useState(getDefaultFormData(initialData));
  const [hourInputs, setHourInputs] = useState<HourInputs>(getDefaultHourInputs(initialData));
  const [touched, setTouched] = useState<Record<string, boolean>>({});

  const isLoading = externalLoading || isSaving;

  // Parse hour values for validation
  const parsedHours = useMemo(() => ({
    sleepHours: parseHours(hourInputs.sleepHours),
    workHours: parseHours(hourInputs.workHours),
    outdoorHours: parseHours(hourInputs.outdoorHours),
  }), [hourInputs]);

  // Validation logic
  const errors = useMemo((): FormErrors => {
    const errs: FormErrors = {};
    const { errors: errorMessages } = form;

    // Date validation
    if (!formData.date) {
      errs.date = errorMessages.dateRequired;
    } else if (formData.date > toISODateString()) {
      errs.date = errorMessages.dateFuture;
    }

    // Sleep hours validation
    if (hourInputs.sleepHours.trim() === "") {
      // Empty is allowed, will default to 0 on submit
    } else if (isNaN(parsedHours.sleepHours) || !Number.isInteger(parsedHours.sleepHours)) {
      errs.sleepHours = errorMessages.invalidNumber;
    } else if (parsedHours.sleepHours < 0 || parsedHours.sleepHours > 24) {
      errs.sleepHours = errorMessages.sleepRange;
    }

    // Work hours validation
    if (hourInputs.workHours.trim() === "") {
      // Empty is allowed, will default to 0 on submit
    } else if (isNaN(parsedHours.workHours) || !Number.isInteger(parsedHours.workHours)) {
      errs.workHours = errorMessages.invalidNumber;
    } else if (parsedHours.workHours < 0 || parsedHours.workHours > 24) {
      errs.workHours = errorMessages.workRange;
    }

    // Outdoor hours validation
    if (hourInputs.outdoorHours.trim() === "") {
      // Empty is allowed, will default to 0 on submit
    } else if (isNaN(parsedHours.outdoorHours) || !Number.isInteger(parsedHours.outdoorHours)) {
      errs.outdoorHours = errorMessages.invalidNumber;
    } else if (parsedHours.outdoorHours < 0 || parsedHours.outdoorHours > 24) {
      errs.outdoorHours = errorMessages.outdoorRange;
    }

    // Total hours validation (treat empty as 0)
    const totalHours = 
      (isNaN(parsedHours.sleepHours) ? 0 : parsedHours.sleepHours) + 
      (isNaN(parsedHours.workHours) ? 0 : parsedHours.workHours) + 
      (isNaN(parsedHours.outdoorHours) ? 0 : parsedHours.outdoorHours);
    if (totalHours > 24) {
      errs.totalHours = errorMessages.totalHours;
    }

    return errs;
  }, [formData, hourInputs, parsedHours, form]);

  const hasErrors = Object.keys(errors).length > 0;
  const isSubmitDisabled = hasErrors || isLoading;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Mark all fields as touched to show any errors
    setTouched({ date: true, sleepHours: true, workHours: true, outdoorHours: true });
    
    if (hasErrors) return;
    
    setIsSaving(true);
    
    // Simulate a small delay to show the spinner
    await new Promise((resolve) => setTimeout(resolve, 500));
    
    // Build final data with parsed numbers (empty = 0)
    const finalData: DiaryEntryInput = {
      ...formData,
      sleepHours: isNaN(parsedHours.sleepHours) ? 0 : parsedHours.sleepHours,
      workHours: isNaN(parsedHours.workHours) ? 0 : parsedHours.workHours,
      outdoorHours: isNaN(parsedHours.outdoorHours) ? 0 : parsedHours.outdoorHours,
    };
    
    onSubmit(finalData);
    setIsSaving(false);
    setShowSaved(true);
    
    // Reset form to defaults after successful submission
    setTimeout(() => {
      setShowSaved(false);
      setTouched({});
      setFormData({
        date: toISODateString(),
        mood: 3,
        meals: "",
        activities: "",
        notes: "",
      });
      setHourInputs({
        sleepHours: "7",
        workHours: "8",
        outdoorHours: "0",
      });
    }, 2000);
  };

  const handleChange = (field: string, value: string | number) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleHourChange = (field: keyof HourInputs, value: string) => {
    // Only allow digits and empty string
    if (value === "" || /^\d*$/.test(value)) {
      setHourInputs((prev) => ({ ...prev, [field]: value }));
    }
  };

  const handleBlur = (field: string) => {
    setTouched((prev) => ({ ...prev, [field]: true }));
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Error Summary */}
      {hasErrors && Object.keys(touched).length > 0 && (
        <div className="p-4 bg-red-50 dark:bg-red-950 border border-red-200 dark:border-red-800 rounded-lg">
          <div className="flex items-start gap-3">
            <AlertCircle className="h-5 w-5 text-red-500 dark:text-red-400 flex-shrink-0 mt-0.5" />
            <div>
              <p className="font-medium text-red-800 dark:text-red-200">Please fix the following errors:</p>
              <ul className="mt-2 text-sm text-red-600 dark:text-red-400 list-disc list-inside space-y-1">
                {errors.date && <li>{errors.date}</li>}
                {errors.sleepHours && <li>{errors.sleepHours}</li>}
                {errors.workHours && <li>{errors.workHours}</li>}
                {errors.outdoorHours && <li>{errors.outdoorHours}</li>}
                {errors.totalHours && <li>{errors.totalHours}</li>}
              </ul>
            </div>
          </div>
        </div>
      )}

      {/* Date Selector */}
      <div>
        <Input
          type="date"
          label="Date"
          value={formData.date}
          onChange={(e) => handleChange("date", e.target.value)}
          onBlur={() => handleBlur("date")}
          max={toISODateString()}
          error={touched.date ? errors.date : undefined}
        />
      </div>

      {/* Mood Selector */}
      <MoodSelector
        label={form.mood.label}
        value={formData.mood}
        onChange={(mood) => handleChange("mood", mood)}
      />

      {/* Hours Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Input
          type="text"
          inputMode="numeric"
          label={form.sleep.label}
          placeholder={form.sleep.placeholder}
          value={hourInputs.sleepHours}
          onChange={(e) => handleHourChange("sleepHours", e.target.value)}
          onBlur={() => handleBlur("sleepHours")}
          error={touched.sleepHours ? errors.sleepHours : undefined}
        />
        <Input
          type="text"
          inputMode="numeric"
          label={form.work.label}
          placeholder={form.work.placeholder}
          value={hourInputs.workHours}
          onChange={(e) => handleHourChange("workHours", e.target.value)}
          onBlur={() => handleBlur("workHours")}
          error={touched.workHours ? errors.workHours : undefined}
        />
        <Input
          type="text"
          inputMode="numeric"
          label={form.outdoor.label}
          placeholder={form.outdoor.placeholder}
          value={hourInputs.outdoorHours}
          onChange={(e) => handleHourChange("outdoorHours", e.target.value)}
          onBlur={() => handleBlur("outdoorHours")}
          error={touched.outdoorHours ? errors.outdoorHours : undefined}
        />
      </div>

      {/* Total Hours Warning */}
      {errors.totalHours && touched.sleepHours && touched.workHours && touched.outdoorHours && (
        <div className="p-3 bg-orange-50 dark:bg-orange-950 border border-orange-200 dark:border-orange-800 rounded-lg flex items-center gap-2">
          <AlertCircle className="h-4 w-4 text-orange-500 dark:text-orange-400 flex-shrink-0" />
          <p className="text-sm text-orange-700 dark:text-orange-300">{errors.totalHours}</p>
        </div>
      )}

      {/* Meals */}
      <Textarea
        label={form.meals.label}
        placeholder={form.meals.placeholder}
        value={formData.meals}
        onChange={(e) => handleChange("meals", e.target.value)}
        rows={3}
      />

      {/* Activities */}
      <Textarea
        label={form.activities.label}
        placeholder={form.activities.placeholder}
        value={formData.activities}
        onChange={(e) => handleChange("activities", e.target.value)}
        rows={2}
      />

      {/* Free Expression */}
      <Textarea
        label={form.notes.label}
        placeholder={form.notes.placeholder}
        value={formData.notes}
        onChange={(e) => handleChange("notes", e.target.value)}
        rows={4}
      />

      {/* Submit Button */}
      <Button type="submit" isLoading={isSaving} disabled={isSubmitDisabled} className="w-full" size="lg">
        {isSaving ? (
          form.saving
        ) : showSaved ? (
          <>
            <Check className="mr-2 h-5 w-5" />
            {form.saved}
          </>
        ) : (
          <>
            <Save className="mr-2 h-5 w-5" />
            {form.submit}
          </>
        )}
      </Button>
    </form>
  );
}
