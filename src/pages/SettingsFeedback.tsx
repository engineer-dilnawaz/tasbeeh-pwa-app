import { useEffect, useRef, useState, type ChangeEvent } from "react";
import { CheckCircle2, Upload, X } from "lucide-react";
import { useForm, useWatch } from "react-hook-form";

import { SettingsActionSheet } from "@/features/settings/components/SettingsActionSheet";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/shared/design-system/ui/Form";
import { SegmentedControl } from "@/shared/design-system/ui/SegmentedControl";
import { Squircle } from "@/shared/design-system/ui/Squircle";
import { Switch } from "@/shared/design-system/ui/Switch";
import { Text } from "@/shared/design-system/ui/Text";
import { TextInput } from "@/shared/design-system/ui/TextInput";

interface ScreenshotItem {
  file: File;
  previewUrl: string;
}

interface FeedbackFormValues {
  feedbackType: "issue" | "suggestion" | "appreciation";
  title: string;
  description: string;
  rating: number;
  includeUserInfo: boolean;
}

export default function SettingsFeedback() {
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const screenshotsRef = useRef<ScreenshotItem[]>([]);
  const [screenshots, setScreenshots] = useState<ScreenshotItem[]>([]);
  const [showSuccessSheet, setShowSuccessSheet] = useState(false);

  const form = useForm<FeedbackFormValues>({
    mode: "onChange",
    defaultValues: {
      feedbackType: "issue",
      title: "",
      description: "",
      rating: 0,
      includeUserInfo: true,
    },
  });

  const feedbackType = useWatch({ control: form.control, name: "feedbackType" });
  const description = useWatch({ control: form.control, name: "description" });
  const rating = useWatch({ control: form.control, name: "rating" });
  const includeUserInfo = useWatch({
    control: form.control,
    name: "includeUserInfo",
  });

  const handleImagePick = (event: ChangeEvent<HTMLInputElement>) => {
    const selected = Array.from(event.target.files ?? [])
      .filter((file) => file.type.startsWith("image/"))
      .slice(0, 5);

    setScreenshots((prev) => {
      const merged = [...prev];
      const seen = new Set(
        prev.map(
          (item) =>
            `${item.file.name}-${item.file.size}-${item.file.lastModified}`,
        ),
      );

      selected.forEach((file) => {
        if (merged.length >= 5) return;
        const signature = `${file.name}-${file.size}-${file.lastModified}`;
        if (seen.has(signature)) return;
        seen.add(signature);
        merged.push({
          file,
          previewUrl: URL.createObjectURL(file),
        });
      });

      return merged;
    });

    event.target.value = "";
  };

  const resetForm = () => {
    form.reset();
    screenshots.forEach((item) => URL.revokeObjectURL(item.previewUrl));
    setScreenshots([]);
  };

  useEffect(() => {
    screenshotsRef.current = screenshots;
  }, [screenshots]);

  useEffect(() => {
    return () => {
      screenshotsRef.current.forEach((item) =>
        URL.revokeObjectURL(item.previewUrl),
      );
    };
  }, []);

  return (
    <div className="mx-auto flex w-full max-w-[480px] flex-col gap-4 px-4 pt-4">
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(() => {
            setShowSuccessSheet(true);
          })}
          className="contents"
        >
          <div className="space-y-2">
            <Text variant="body" weight="medium">
              Feedback type
            </Text>
            <SegmentedControl
              options={[
                { label: "Issue", value: "issue" },
                { label: "Suggestion", value: "suggestion" },
                { label: "Appreciation", value: "appreciation" },
              ]}
              value={feedbackType}
              onChange={(value) =>
                form.setValue("feedbackType", value, {
                  shouldDirty: true,
                  shouldValidate: true,
                })
              }
            />
          </div>

          <FormField
            control={form.control}
            name="title"
            rules={{
              required: "Title is required.",
            }}
            render={({ field }) => (
              <FormItem>
                <FormLabel>Title</FormLabel>
                <FormControl>
                  <Squircle
                    cornerRadius={18}
                    cornerSmoothing={0.9}
                    className="surface-card w-full p-1"
                  >
                    <TextInput
                      {...field}
                      placeholder="Short summary of your feedback"
                      variant="ghost"
                      className="bg-transparent"
                    />
                  </Squircle>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="description"
            rules={{
              required: "Description is required.",
              minLength: {
                value: 15,
                message: "Please add at least 15 characters.",
              },
              maxLength: {
                value: 500,
                message: "Maximum 500 characters allowed.",
              },
            }}
            render={({ field }) => (
              <FormItem>
                <div className="mb-2 flex items-center justify-between">
                  <FormLabel>Description</FormLabel>
                  <Text variant="body" color="subtle">
                    {description.length}/500 characters
                  </Text>
                </div>
                <FormControl>
                  <Squircle
                    cornerRadius={18}
                    cornerSmoothing={0.9}
                    className="surface-card w-full p-1"
                  >
                    <textarea
                      value={field.value}
                      onChange={field.onChange}
                      maxLength={500}
                      rows={8}
                      placeholder={
                        feedbackType === "issue"
                          ? "Explain what happened, expected behavior, and steps."
                          : "Share your detailed feedback..."
                      }
                      className="h-40 w-full resize-none border-none bg-transparent px-3 py-2.5 text-sm outline-none transition-colors"
                    />
                  </Squircle>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <div className="space-y-2">
            <Text variant="body" weight="medium">
              Rating (optional)
            </Text>
            <div className="rating rating-md">
              <input
                type="radio"
                name="feedback-rating"
                className="rating-hidden"
                aria-label="Clear rating"
                checked={rating === 0}
                onChange={() => form.setValue("rating", 0)}
              />
              {[1, 2, 3, 4, 5].map((value) => (
                <input
                  key={value}
                  type="radio"
                  name="feedback-rating"
                  className="mask mask-star-2 bg-primary"
                  aria-label={`${value} star`}
                  checked={rating === value}
                  onChange={() => form.setValue("rating", value)}
                />
              ))}
            </div>
          </div>

          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <Text variant="body" weight="medium">
                Screenshots (optional)
              </Text>
              <Text variant="body" color="subtle">
                {screenshots.length}/5 images
              </Text>
            </div>
            <input
              ref={fileInputRef}
              type="file"
              accept=".png,.jpg,.jpeg,.webp,.gif"
              multiple
              className="hidden"
              onChange={handleImagePick}
            />
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              className="inline-flex items-center gap-2 rounded-xl border border-base-content/15 px-3 py-2 text-sm font-medium"
            >
              <Upload size={15} />
              Add screenshot
            </button>
            {screenshots.length > 0 ? (
              <div className="flex flex-wrap gap-2">
                {screenshots.map((item, index) => (
                  <div key={`${item.file.name}-${index}`} className="relative">
                    <Squircle
                      cornerRadius={14}
                      cornerSmoothing={0.9}
                      className="surface-card h-20 w-20 overflow-hidden"
                    >
                      <img
                        src={item.previewUrl}
                        alt={item.file.name}
                        className="h-full w-full object-cover"
                      />
                    </Squircle>
                    <button
                      type="button"
                      onClick={() =>
                        setScreenshots((prev) => {
                          const target = prev[index];
                          if (target) URL.revokeObjectURL(target.previewUrl);
                          return prev.filter((_, fileIndex) => fileIndex !== index);
                        })
                      }
                      aria-label="Remove screenshot"
                      className="absolute -right-1 -top-1 flex h-5 w-5 items-center justify-center rounded-full bg-black/75 text-white"
                    >
                      <X size={11} />
                    </button>
                  </div>
                ))}
              </div>
            ) : null}
          </div>

          <Squircle
            cornerRadius={18}
            cornerSmoothing={0.9}
            className="surface-card w-full px-3 py-2.5"
          >
            <div className="flex items-center justify-between">
              <div className="pr-3">
                <Text variant="body" weight="medium">
                  Include my profile info
                </Text>
                <Text
                  variant="body"
                  color="subtle"
                  className="text-[12px] leading-snug"
                >
                  Name/email can be sent with
                  <br />
                  this feedback.
                </Text>
              </div>
              <Switch
                checked={includeUserInfo}
                onChange={(checked) => form.setValue("includeUserInfo", checked)}
              />
            </div>
          </Squircle>

          <div className="sticky bottom-0 z-20 -mx-4 px-4 pb-[max(8px,env(safe-area-inset-bottom,0px))] pt-2">
            <Squircle cornerRadius={20} cornerSmoothing={0.92} asChild>
              <button
                type="submit"
                className="w-full bg-neutral px-4 py-3.5 text-sm font-semibold text-white shadow-md"
              >
                Submit feedback
              </button>
            </Squircle>
          </div>
        </form>
      </Form>

      <SettingsActionSheet
        isOpen={showSuccessSheet}
        onClose={() => setShowSuccessSheet(false)}
        icon={CheckCircle2}
        title="Feedback sent"
        description="Thanks, your feedback was sent."
        primaryButtonTitle="Okay"
        onPrimaryPress={() => setShowSuccessSheet(false)}
        secondaryButtonTitle="Submit another feedback"
        onSecondaryPress={() => {
          resetForm();
          setShowSuccessSheet(false);
        }}
        snapPoints={["38%"]}
        iconWrapperClassName="border border-primary/35 bg-primary/12 text-primary"
      />
    </div>
  );
}
