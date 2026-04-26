import { useState } from "react";
import { Text, Surface, Button, TextInput, Divider, Badge, Skeleton, Avatar, Switch } from "../atoms";
import { useTheme } from "../hooks/useTheme";

export default function ComponentLab() {
  const [isToggled, setIsToggled] = useState(false);
  const { theme, setTheme } = useTheme();

  return (
    <div className="min-h-screen bg-ds-bg-page p-8 transition-colors duration-300">
      <div className="mx-auto max-w-4xl space-y-12">
        <header className="flex items-center justify-between sticky top-0 z-50 py-4 bg-ds-bg-page/80 backdrop-blur-md">
          <div className="space-y-1">
            <h1 className="text-display text-ds-text-main">Divine Lab</h1>
            <p className="text-ds-text-subtle text-sm">Testing grounds for DAS primitives.</p>
          </div>
          
          <div className="flex items-center gap-3 bg-ds-bg-surface px-4 py-2 rounded-2xl shadow-sm">
            <Text variant="caption" weight="bold">DARK MODE</Text>
            <Switch 
              checked={theme === "dark"} 
              onChange={(checked) => setTheme(checked ? "dark" : "light")} 
            />
          </div>
        </header>

        {/* Surface Section */}
        <section className="space-y-6">
          <h2 className="text-heading text-2xl text-ds-text-main pb-2">Surfaces</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <p className="text-[10px] font-black uppercase tracking-[0.2em] text-ds-text-subtle">Default Surface</p>
              <Surface className="p-8">
                <Text>Standard elevated surface with particle blocking.</Text>
              </Surface>
            </div>
            
            <div className="space-y-2">
              <p className="text-[10px] font-black uppercase tracking-[0.2em] text-ds-text-subtle">Interactive Surface</p>
              <Surface 
                asChild 
                className="p-8 active:scale-[0.98] transition-transform cursor-pointer"
              >
                <button>
                  <Text weight="bold">Tap me</Text>
                </button>
              </Surface>
            </div>
          </div>
        </section>

        {/* Buttons Section */}
        <section className="space-y-6">
          <h2 className="text-heading text-2xl text-ds-text-main pb-2">Buttons</h2>
          <div className="flex flex-wrap gap-4">
            <Button variant="primary">Primary Button</Button>
            <Button variant="secondary">Secondary</Button>
            <Button variant="outline">Outline</Button>
            <Button variant="ghost">Ghost</Button>
          </div>
          <div className="flex flex-wrap gap-4">
            <Button variant="primary" isLoading>Loading</Button>
            <Button variant="primary" size="lg">Large Button</Button>
            <Button variant="primary" size="sm">Small</Button>
          </div>
        </section>

        {/* Inputs Section */}
        <section className="space-y-6">
          <h2 className="text-heading text-2xl text-ds-text-main pb-2">Inputs</h2>
          <div className="max-w-md space-y-4">
            <TextInput placeholder="Default Bordered Input" />
            <TextInput variant="ghost" placeholder="Ghost Variant" />
            <TextInput variant="transparent" placeholder="Transparent Variant" />
            <TextInput isInvalid placeholder="Invalid State" />
          </div>
        </section>

        {/* Divider & Badges */}
        <section className="space-y-6">
          <h2 className="text-heading text-2xl text-ds-text-main pb-2">Separators & Tags</h2>
          <div className="flex flex-col gap-6 p-6 bg-ds-bg-surface rounded-3xl shadow-sm">
            <div className="flex flex-wrap gap-2">
              <Badge variant="primary">New</Badge>
              <Badge variant="success">Completed</Badge>
              <Badge variant="error">Critical</Badge>
              <Badge variant="warning">Pending</Badge>
              <Badge variant="secondary">Archived</Badge>
            </div>
            
            <Divider />
            
            <div className="flex items-center gap-4">
              <Badge size="sm" variant="primary">v2.0</Badge>
              <Text variant="caption">System baseline established.</Text>
            </div>
          </div>
        </section>

        {/* Skeletons */}
        <section className="space-y-6">
          <h2 className="text-heading text-2xl text-ds-text-main pb-2">Loading States</h2>
          <div className="p-6 bg-ds-bg-surface rounded-3xl shadow-sm space-y-6">
            <div className="flex items-center gap-4">
              <Skeleton circle width={48} height={48} />
              <div className="flex-1 space-y-2">
                <Skeleton width="40%" height={12} />
                <Skeleton width="25%" height={8} />
              </div>
            </div>
            <Skeleton height={120} cornerRadius={20} />
          </div>
        </section>

        {/* Avatars */}
        <section className="space-y-6">
          <h2 className="text-heading text-2xl text-ds-text-main pb-2">Avatars</h2>
          <div className="flex flex-wrap items-center gap-6 p-6 bg-ds-bg-surface rounded-3xl shadow-sm">
            <Avatar size="xl" name="Dilnawaz Khan" status="online" />
            <Avatar size="lg" name="Fatima Zahra" status="away" />
            <Avatar size="md" name="Ali Ibn" status="offline" />
            <Avatar size="sm" name="Zaid" />
            <Avatar size="md" shape="circle" name="Circle User" status="online" />
          </div>
        </section>

        {/* Switch */}
        <section className="space-y-6">
          <h2 className="text-heading text-2xl text-ds-text-main pb-2">Switches</h2>
          <div className="flex items-center gap-8 p-6 bg-ds-bg-surface rounded-3xl shadow-sm">
            <div className="flex flex-col items-center gap-2">
              <Switch checked={isToggled} onChange={setIsToggled} />
              <Text variant="caption">Default</Text>
            </div>
            <div className="flex flex-col items-center gap-2">
              <Switch size="sm" checked={isToggled} onChange={setIsToggled} />
              <Text variant="caption">Small</Text>
            </div>
            <div className="flex flex-col items-center gap-2">
              <Switch checked={true} onChange={() => {}} disabled />
              <Text variant="caption">Disabled</Text>
            </div>
          </div>
        </section>

        {/* Text Section */}
        <section className="space-y-6">
          <h2 className="text-heading text-2xl text-ds-text-main pb-2">Typography</h2>
          <div className="space-y-6">
            <Text variant="display">Display Text</Text>
            <Text variant="heading" className="text-4xl">Heading Extra Large</Text>
            <Text variant="heading" className="text-2xl">Heading Medium</Text>
            <Text variant="body">Body text for general information and descriptions that need to be clear and readable.</Text>
            <Text variant="caption" color="subtle">Caption text for minor details and secondary information.</Text>
          </div>
        </section>
      </div>
    </div>
  );
}
