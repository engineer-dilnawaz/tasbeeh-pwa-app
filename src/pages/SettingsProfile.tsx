import { useAuth } from "@/services/firebase/auth";
import { Cloud, ImagePlus, ShieldCheck, Sparkles, X } from "lucide-react";
import { useRef, useState, type ChangeEvent } from "react";
import { useForm, useWatch } from "react-hook-form";

import { useSettingsStore } from "@/features/settings/store/settingsStore";
import { Avatar } from "@/shared/design-system/ui/Avatar";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/shared/design-system/ui/Form";
import { Squircle } from "@/shared/design-system/ui/Squircle";
import { Switch } from "@/shared/design-system/ui/Switch";
import { Text } from "@/shared/design-system/ui/Text";
import { TextInput } from "@/shared/design-system/ui/TextInput";
import { toast } from "@/shared/design-system/ui/useToast";
import { useNavigate } from "react-router-dom";

interface ProfileFormValues {
  displayName: string;
  email: string;
  username: string;
  avatarUrl: string;
  bio: string;
  profileVisible: boolean;
}

export default function SettingsProfile() {
  const navigate = useNavigate();
  const { user, isAuthenticated, loading } = useAuth();
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const profile = useSettingsStore((state) => state.profile);
  const setProfile = useSettingsStore((state) => state.setProfile);
  const [avatarPreview, setAvatarPreview] = useState(profile.avatarUrl);

  const form = useForm<ProfileFormValues>({
    mode: "onChange",
    defaultValues: {
      displayName: user?.displayName || profile.displayName,
      email: user?.email || profile.email,
      username: profile.username,
      avatarUrl: user?.photoURL || profile.avatarUrl,
      bio: profile.bio,
      profileVisible: profile.profileVisible,
    },
  });
  const bio = useWatch({
    control: form.control,
    name: "bio",
  });
  const displayName = useWatch({
    control: form.control,
    name: "displayName",
  });

  const handleAvatarSelect = async (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;
    if (!file.type.startsWith("image/")) return;

    const asDataUrl = await readFileAsDataUrl(file);
    setAvatarPreview(asDataUrl);
    form.setValue("avatarUrl", asDataUrl, {
      shouldDirty: true,
      shouldValidate: true,
    });
    event.target.value = "";
  };

  if (loading) {
    return (
      <div className="flex h-[400px] w-full items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-2 border-primary border-t-transparent" />
      </div>
    );
  }

  if (!isAuthenticated) {
    return (
      <div className="mx-auto flex w-full max-w-[480px] flex-col gap-6 px-4 pt-8">
        <Squircle
          cornerRadius={32}
          cornerSmoothing={0.9}
          className="surface-card flex flex-col items-center p-8 text-center shadow-xl shadow-primary/5"
        >
          <div className="mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-primary/10 text-primary">
            <Cloud size={44} />
          </div>

          <Text variant="heading" className="mb-2 text-2xl font-black">
            Sync Progress
          </Text>
          <Text variant="body" color="subtle" className="mb-8 leading-relaxed">
            Connect your account to save your tasbeeh collections and streaks
            forever. Never lose your spiritual progress.
          </Text>

          <div className="flex flex-col gap-3 w-full">
            <Squircle cornerRadius={20} cornerSmoothing={0.9} asChild>
              <button
                onClick={() => navigate("/signin")}
                className="flex h-14 w-full items-center justify-center gap-2 bg-base-content font-bold text-base-100 transition-transform active:scale-[0.98]"
              >
                <Sparkles size={18} />
                Sign in to Cloud
              </button>
            </Squircle>

            <div className="flex items-center justify-center gap-2 mt-4 text-base-content/30 lowercase">
              <ShieldCheck size={14} />
              <Text variant="caption">Privacy First. No ads. Just sync.</Text>
            </div>
          </div>
        </Squircle>
      </div>
    );
  }

  return (
    <div className="mx-auto flex w-full max-w-[480px] flex-col gap-4 px-4 pt-4">
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit((values) => {
            setProfile({
              displayName: values.displayName.trim(),
              email: values.email.trim(),
              username: values.username.trim(),
              avatarUrl: values.avatarUrl.trim(),
              bio: values.bio.trim(),
              profileVisible: values.profileVisible,
            });
            toast("Profile updated", {
              variant: "success",
              description: "Your profile changes were saved.",
            });
          })}
          className="flex flex-col gap-4 pb-20"
        >
          <Squircle
            cornerRadius={22}
            cornerSmoothing={0.9}
            className="surface-card w-full p-4"
          >
            <div className="flex items-center gap-4">
              <Avatar
                size="xl"
                name={displayName || profile.displayName}
                src={avatarPreview || user?.photoURL || undefined}
                shape="circle"
                disableHover
              />
              <div className="flex flex-1 flex-col gap-2">
                <input
                  ref={fileInputRef}
                  type="file"
                  accept=".png,.jpg,.jpeg,.webp,.gif"
                  className="hidden"
                  onChange={handleAvatarSelect}
                />
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  className="inline-flex items-center justify-center gap-2 rounded-xl border border-base-content/15 px-3 py-2 text-sm font-medium"
                >
                  <ImagePlus size={15} />
                  Change photo
                </button>
                {avatarPreview || user?.photoURL ? (
                  <button
                    type="button"
                    onClick={() => {
                      setAvatarPreview("");
                      form.setValue("avatarUrl", "", { shouldDirty: true });
                    }}
                    className="inline-flex items-center justify-center gap-1 rounded-xl border border-base-content/12 px-3 py-2 text-sm text-base-content/70"
                  >
                    <X size={14} />
                    Remove photo
                  </button>
                ) : null}
              </div>
            </div>
          </Squircle>

          <FormField
            control={form.control}
            name="displayName"
            rules={{
              required: "Display name is required.",
              minLength: {
                value: 2,
                message: "Display name should be at least 2 characters.",
              },
            }}
            render={({ field }) => (
              <FormItem>
                <FormLabel>Display Name</FormLabel>
                <FormControl>
                  <TextInput
                    {...field}
                    variant="white"
                    className="shadow-sm"
                    placeholder="Your display name"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="email"
            rules={{
              required: "Email is required.",
              pattern: {
                value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                message: "Enter a valid email address.",
              },
            }}
            render={({ field }) => (
              <FormItem>
                <FormLabel>Email</FormLabel>
                <FormControl>
                  <TextInput
                    {...field}
                    variant="white"
                    disabled={!!user}
                    className="shadow-sm"
                    placeholder="name@example.com"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="username"
            rules={{
              required: "Username is required.",
              pattern: {
                value: /^@?[a-zA-Z0-9._]{3,30}$/,
                message: "Use @name format with 3-30 valid characters (letters, numbers, . or _).",
              },
            }}
            render={({ field }) => (
              <FormItem>
                <FormLabel>Username</FormLabel>
                <FormControl>
                  <TextInput
                    {...field}
                    variant="white"
                    className="shadow-sm"
                    placeholder="@username"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="bio"
            rules={{
              maxLength: {
                value: 120,
                message: "Bio can be at most 120 characters.",
              },
            }}
            render={({ field }) => (
              <FormItem>
                <div className="flex items-center justify-between">
                  <FormLabel>Bio (optional)</FormLabel>
                  <Text variant="caption" color="subtle">
                    {(bio ?? "").length}/120
                  </Text>
                </div>
                <FormControl>
                  <div className="w-full relative">
                    <Squircle cornerRadius={18} cornerSmoothing={0.9} asChild>
                      <div className="absolute inset-0 bg-base-100 pointer-events-none" />
                    </Squircle>
                    <Squircle cornerRadius={18} cornerSmoothing={0.9} asChild>
                      <textarea
                        {...field}
                        rows={3}
                        maxLength={120}
                        placeholder="A short line about you..."
                        className="w-full resize-none bg-(--color-surface-card) px-4 py-3 text-sm text-base-content outline-none placeholder:text-base-content/40 relative z-10 block shadow-sm"
                      />
                    </Squircle>
                  </div>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="profileVisible"
            render={({ field }) => (
              <FormItem>
                <Squircle
                  cornerRadius={18}
                  cornerSmoothing={0.9}
                  className="surface-card w-full p-4"
                >
                  <div
                    role="button"
                    tabIndex={0}
                    className="flex select-none items-center justify-between"
                    onClick={() => field.onChange(!field.value)}
                    onKeyDown={(event) => {
                      if (event.key === "Enter" || event.key === " ") {
                        event.preventDefault();
                        field.onChange(!field.value);
                      }
                    }}
                  >
                    <div>
                      <Text variant="body" weight="medium">
                        Profile visibility
                      </Text>
                      <Text variant="caption" color="subtle">
                        Control whether your profile details are visible.
                      </Text>
                    </div>
                    <div
                      onClick={(event) => event.stopPropagation()}
                      onMouseDown={(event) => event.stopPropagation()}
                    >
                      <Switch
                        checked={Boolean(field.value)}
                        onChange={field.onChange}
                      />
                    </div>
                  </div>
                </Squircle>
              </FormItem>
            )}
          />

          <div className="fixed bottom-0 left-0 right-0 z-20 flex gap-2 bg-base-100/95 px-6 pb-[max(16px,env(safe-area-inset-bottom,0px))] pt-4 backdrop-blur-sm shadow-[0_-1px_0_0_rgba(0,0,0,0.05)]">
            <Squircle cornerRadius={100} cornerSmoothing={0.92} asChild>
              <button
                type="submit"
                className="flex h-14 w-full items-center justify-center bg-base-content px-4 text-sm font-black text-base-100 shadow-xl shadow-base-content/10 active:scale-[0.98] transition-transform"
              >
                Save Changes
              </button>
            </Squircle>
          </div>
        </form>
      </Form>
    </div>
  );
}

function readFileAsDataUrl(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(String(reader.result ?? ""));
    reader.onerror = () => reject(new Error("Failed to read file"));
    reader.readAsDataURL(file);
  });
}
