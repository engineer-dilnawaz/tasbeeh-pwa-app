import {
  Accordion,
  Avatar,
  AvatarGroup,
  Badge,
  BottomNav,
  Button,
  Calendar,
  CalendarActivityList,
  type CalendarSystem,
  type CalendarVariant,
  Card,
  ChatBubble,
  Checkbox,
  Counter,
  Dialog,
  Drawer,
  EmptyState,
  FAB,
  Header,
  Indicator,
  List,
  ListItem,
  ProgressRing,
  PullToRefresh,
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormGroup,
  FormItem,
  FormLabel,
  FormMessage,
  Skeleton,
  StatsBarChart,
  Switch,
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
  TimePicker,
  type TabItem,
  Text,
  TextInput,
  Toaster,
  type ZikrRecord,
  toast,
  useDrawer,
  useTheme,
} from "@/shared/design-system";
import { format } from "date-fns";
import {
  BarChart2,
  BookOpen,
  ChevronRight,
  Clock,
  Eye,
  Home,
  Inbox,
  Lock,
  Mail,
  Minus,
  Plus,
  Search,
  Settings,
  Star,
  Trash2,
} from "lucide-react";
import { useState } from "react";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

function ChatGallery() {
  return (
    <section className="flex flex-col gap-6">
      <Text variant="caption">Chat UI Primitive (AI Bot Edition)</Text>

      <div className="flex flex-col rounded-[24px] bg-base-100 border border-base-content/5 p-3 min-h-[300px]">
        <ChatBubble
          message="Assalamu Alaikum! How are you doing today?"
          isUser={false}
          time="10:41 AM"
        />
        <ChatBubble
          message="Walaikum Assalam! I'm doing well, Alhamdullilah. Just finished my morning Zikr."
          isUser={true}
          status="read"
          time="10:43 AM"
        />
        <ChatBubble
          message="MashaAllah, that's great to hear. I was thinking of adding a new objective to my list."
          isUser={false}
          isConsecutive={false}
          onCopy={() => console.log("Copied!")}
        />
        <ChatBubble
          message="Any recommendations?"
          isUser={false}
          isConsecutive={true}
          time="10:45 AM"
          onCopy={() => console.log("Copied!")}
          onRegenerate={() => console.log("Regenerating response...")}
        />
        <ChatBubble
          message="Definitely start with Salawat. It brings so much barakah to the day! Added a popular one below."
          isUser={false}
          status="read"
          isConsecutive={false}
          suggestedTasbeeh={{
            arabic: "اللَّهُمَّ صَلِّ وَسَلِّمْ عَلَى نَبِيِّنَا مُحَمَّدٍ",
            transliteration:
              "Allahumma salli wa sallim 'ala nabiyyina Muhammad",
            translation:
              "O Allah, send blessings and peace upon our Prophet Muhammad",
            targetCount: 100,
          }}
          onAddTasbeeh={(t) =>
            alert(`Added ${t.targetCount} iterations to collection.`)
          }
        />
        <ChatBubble
          message="Thank you! Will add."
          isUser={true}
          status="read"
          isConsecutive={false}
          time="10:47 AM"
        />
        <div className="mt-4">
          <ChatBubble message="" isUser={false} isTyping={true} />
        </div>
      </div>
    </section>
  );
}

function SkeletonGallery() {
  return (
    <section className="flex flex-col gap-6">
      <Text variant="caption">Skeleton Loaders (Latency Masking)</Text>

      <div className="flex flex-col gap-8 py-2">
        {/* Simple Profile Mock */}
        <div className="flex items-center gap-4">
          <Skeleton variant="circular" />
          <div className="flex flex-col gap-2 flex-1 pt-1">
            <Skeleton variant="text" width="60%" />
            <Skeleton variant="text" width="40%" />
          </div>
        </div>

        {/* Analytics Card Mock */}
        <div className="flex flex-col gap-4">
          <Skeleton variant="card" />
          <div className="grid grid-cols-2 gap-3 mt-1">
            <Skeleton variant="rectangular" height="4.5rem" />
            <Skeleton variant="rectangular" height="4.5rem" />
          </div>
        </div>

        {/* List Mock */}
        <div className="flex flex-col gap-3">
          <Skeleton variant="rectangular" height="3.5rem" />
          <Skeleton variant="rectangular" height="3.5rem" />
          <Skeleton variant="rectangular" height="3.5rem" />
        </div>
      </div>
    </section>
  );
}

function DialogGallery() {
  const [showDestructive, setShowDestructive] = useState(false);
  const [showConfirmation, setShowConfirmation] = useState(false);

  return (
    <section className="flex flex-col gap-6">
      <Text variant="caption">Dialog / Modal Overlays</Text>

      <div className="flex gap-4">
        <Button
          onClick={() => setShowConfirmation(true)}
          variant="secondary"
          className="flex-1"
        >
          Open Standard
        </Button>
        <Button
          onClick={() => setShowDestructive(true)}
          variant="outline"
          className="flex-1 text-error border-error/50"
        >
          Open Destructive
        </Button>
      </div>

      <Dialog
        isOpen={showConfirmation}
        onClose={() => setShowConfirmation(false)}
        title="Complete Objective"
        description="Are you sure you want to mark this daily Zikr target as completed? It will be added to your historical streak."
        primaryActionLabel="Yes, Complete"
        onPrimaryAction={() => console.log("Marking as complete")}
      />

      <Dialog
        isOpen={showDestructive}
        onClose={() => setShowDestructive(false)}
        title="Reset Progress?"
        description="This will permanently delete all Tasbeeh counts and active streaks associated with this collection. This cannot be undone."
        primaryActionLabel="Reset Everything"
        primaryVariant="error"
        onPrimaryAction={() =>
          toast("Progress was successfully wiped", {
            variant: "error",
            duration: 3000,
          })
        }
      />
    </section>
  );
}

function ToastGallery() {
  return (
    <section className="flex flex-col gap-6">
      <Text variant="caption">Toast / Snackbar Notifications</Text>

      <div className="flex flex-col gap-3 p-4 rounded-[24px] bg-base-100 border border-base-content/5">
        <div className="flex flex-wrap gap-3">
          <Button
            variant="ghost"
            className="flex-1 bg-base-content/5"
            onClick={() =>
              toast("Objective saved", {
                description: "Tasbeeh added to your daily tracker.",
              })
            }
          >
            Default
          </Button>
          <Button
            variant="ghost"
            className="flex-1 bg-success/10 text-success hover:bg-success/20"
            onClick={() =>
              toast("Sync Complete", {
                variant: "success",
                description: "All zikr data backed up.",
                duration: 3000,
              })
            }
          >
            Success
          </Button>
        </div>
        <div className="flex flex-wrap gap-3">
          <Button
            variant="ghost"
            className="flex-1 bg-error/10 text-error hover:bg-error/20"
            onClick={() =>
              toast("Network Lost", {
                variant: "error",
                description: "Running in offline mode.",
              })
            }
          >
            Error
          </Button>
          <Button
            variant="ghost"
            className="flex-1 bg-info/10 text-info hover:bg-info/20"
            onClick={() =>
              toast("Update Available", {
                variant: "info",
                description: "Restart app to install.",
              })
            }
          >
            Info
          </Button>
        </div>
      </div>
    </section>
  );
}

function EmptyStateGallery() {
  return (
    <section className="flex flex-col gap-6">
      <Text variant="caption">Empty / Null States</Text>

      <div className="rounded-[32px] bg-base-100 border border-base-content/5 overflow-hidden">
        <EmptyState
          icon={<Inbox />}
          title="No Zikr History"
          description="Your calendar history is completely clean for this month. Take a moment to capture some peace."
          actionLabel="Start New Tasbeeh"
          onAction={() => console.log("Routing to counter...")}
        />
      </div>
    </section>
  );
}

function AccordionGallery() {
  const accordionItems = [
    {
      id: "1",
      title: "Notification Settings",
      icon: <Clock className="w-5 h-5" />,
      content:
        "Configure when and how you receive reminders for your daily zikr. You can set specific times for morning, afternoon, and evening prayers.",
    },
    {
      id: "2",
      title: "Theme & Customization",
      icon: <Settings className="w-5 h-5" />,
      content:
        "Choose between Light, Dark, and Pine Green themes. You can also customize the haptic feedback intensity and sound effects for each tap.",
    },
    {
      id: "3",
      title: "Data & Privacy",
      icon: <Lock className="w-5 h-5" />,
      content:
        "Your zikr data is stored locally on your device and can be optionally synced with your private Firebase account for multi-device access.",
    },
  ];

  return (
    <section className="flex flex-col gap-6">
      <Text variant="caption">Accordion / Disclosures</Text>
      <Accordion items={accordionItems} />
    </section>
  );
}

function CalendarGallery() {
  const [selected, setSelected] = useState<Date | undefined>(new Date());
  const [variant, setVariant] = useState<CalendarVariant>("monthly");
  const [system, setSystem] = useState<CalendarSystem>("gregorian");

  const dateKey = selected ? format(selected, "yyyy-MM-dd") : "";
  const twoDaysAgo = new Date();
  twoDaysAgo.setDate(twoDaysAgo.getDate() - 2);

  // Mock intensity data
  const intensityData = {
    [format(new Date(), "yyyy-MM-dd")]: 0.8,
    [format(twoDaysAgo, "yyyy-MM-dd")]: 1.0,
  };

  const mockActivities: Record<string, ZikrRecord[]> = {
    [format(new Date(), "yyyy-MM-dd")]: [
      { id: "1", name: "SubhanAllah", count: 33, time: "11:20 AM" },
      { id: "2", name: "Alhamdulillah", count: 33, time: "11:25 AM" },
    ],
  };

  return (
    <section className="flex flex-col gap-6">
      <Calendar
        mode={"single" as const}
        variant={variant}
        system={system}
        onVariantChange={setVariant}
        onSystemChange={setSystem}
        selected={selected}
        onSelect={setSelected}
        intensity={intensityData}
        activities={mockActivities}
      />

      <CalendarActivityList
        activities={selected ? mockActivities[dateKey] || [] : []}
      />
    </section>
  );
}

function StatsGallery() {
  const data = {
    labels: ["S", "M", "T", "W", "T", "F", "S"],
    counts: [2100, 3400, 1800, 4200, 2900, 5600, 3800],
  };

  return (
    <section className="flex flex-col gap-6">
      <Text variant="caption">Activity Insights</Text>

      <Card variant="glass" className="p-6">
        <div className="flex justify-between items-end mb-8">
          <div>
            <Text variant="heading" weight="bold">
              23.8k
            </Text>
            <Text variant="caption" color="subtle">
              Zikr this week
            </Text>
          </div>
          <Badge variant="success" size="sm">
            +12%
          </Badge>
        </div>

        <StatsBarChart labels={data.labels} data={data.counts} height={180} />
      </Card>
    </section>
  );
}

function CounterGallery() {
  const [count, setCount] = useState(33);
  return (
    <section className="flex flex-col gap-6">
      <Text variant="caption">Counter Engine</Text>

      <div className="flex flex-col items-center gap-8 bg-base-100/50 rounded-3xl border border-base-content/5 p-8">
        <Counter value={count} variant="counter" className="text-primary" />

        <div className="flex gap-4">
          <Button
            variant="outline"
            size="sm"
            onClick={() => setCount(Math.max(0, count - 1))}
          >
            <Minus size={18} />
          </Button>
          <Button
            variant="primary"
            size="sm"
            onClick={() => setCount(count + 1)}
          >
            <Plus size={18} />
          </Button>
          <Button variant="ghost" size="sm" onClick={() => setCount(0)}>
            Reset
          </Button>
        </div>

        <div className="grid grid-cols-2 gap-8 w-full">
          <div className="flex flex-col gap-2">
            <Text variant="caption" color="subtle">
              Heading Variant
            </Text>
            <Counter value={count * 10} variant="heading" />
          </div>
          <div className="flex flex-col gap-2 items-end">
            <Text variant="caption" color="subtle">
              Arabic Display
            </Text>
            <Counter value={count} variant="display-arabic" />
          </div>
        </div>
      </div>
    </section>
  );
}

function ProgressRingGallery() {
  const [val, setVal] = useState(65);
  return (
    <section className="flex flex-col gap-6">
      <Text variant="caption">Progress Ring</Text>

      <div className="flex flex-col items-center gap-8">
        <div className="flex items-center justify-center p-8 bg-base-100/50 rounded-3xl border border-base-content/5 w-full">
          <ProgressRing value={val} size={180}>
            <div className="flex flex-col items-center">
              <Text variant="heading" weight="bold">
                {val}%
              </Text>
              <Text variant="caption" color="subtle">
                Target Met
              </Text>
            </div>
          </ProgressRing>
        </div>

        <div className="flex flex-col gap-4 w-full">
          <Text variant="body" color="subtle">
            Live Controls
          </Text>
          <input
            type="range"
            min="0"
            max="100"
            value={val}
            onChange={(e) => setVal(parseInt(e.target.value))}
            className="w-full accent-primary"
          />
        </div>

        <div className="flex gap-10 flex-wrap justify-center">
          <div className="flex flex-col items-center gap-2">
            <ProgressRing
              value={33}
              size={80}
              strokeWidth={6}
              variant="secondary"
            />
            <Text variant="caption">Secondary</Text>
          </div>
          <div className="flex flex-col items-center gap-2">
            <ProgressRing
              value={90}
              size={80}
              strokeWidth={6}
              variant="success"
            />
            <Text variant="caption">Success</Text>
          </div>
          <div className="flex flex-col items-center gap-2">
            <ProgressRing value={50} size={80} strokeWidth={6} glow={false} />
            <Text variant="caption">No Glow</Text>
          </div>
        </div>
      </div>
    </section>
  );
}

function ListGallery() {
  return (
    <section className="flex flex-col gap-6">
      <Text variant="caption">List & ListItem</Text>

      <div className="flex flex-col gap-8">
        {/* Divided Variant (Settings/Menu Style) */}
        <div className="flex flex-col gap-3">
          <Text variant="body" color="subtle">
            Variant: Divided (Stacked Inside Card)
          </Text>
          <List variant="divided">
            <ListItem
              leading={
                <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center text-primary">
                  <Search size={20} />
                </div>
              }
              title="Daily Zikr Search"
              description="Explore over 1,000 authenticated phrases"
              trailing={
                <ChevronRight size={18} className="text-base-content/30" />
              }
              onClick={() => {}}
            />
            <ListItem
              leading={
                <div className="w-10 h-10 rounded-xl bg-secondary/10 flex items-center justify-center text-secondary">
                  <Star size={20} />
                </div>
              }
              title="Favorite Phrases"
              description="Your most-recited bookmarks"
              trailing={<Badge variant="secondary">12 Items</Badge>}
              onClick={() => {}}
            />
            <ListItem
              leading={
                <div className="w-10 h-10 rounded-xl bg-error/10 flex items-center justify-center text-error">
                  <Trash2 size={20} />
                </div>
              }
              title="Clear History"
              description="This action cannot be undone"
              onClick={() => {}}
            />
          </List>
        </div>

        {/* Spaced Variant (Feature Cards Style) */}
        <div className="flex flex-col gap-3">
          <Text variant="body" color="subtle">
            Variant: Spaced (Individual Cards)
          </Text>
          <List variant="spaced" gap={4}>
            <ListItem
              variant="surface"
              leading={<Avatar size="sm" name="Dilnawaz Khan" />}
              title="Dilnawaz Khan"
              description="Last active: 2 minutes ago"
              trailing={<div className="w-2 h-2 rounded-full bg-success" />}
            />
            <ListItem
              variant="surface"
              leading={<Avatar size="sm" shape="squircle" />}
              title="Special Achievement"
              description="You reached 333 SubhanAllah counts!"
              trailing={
                <Button variant="ghost" size="sm">
                  View
                </Button>
              }
            />
          </List>
        </div>
      </div>
    </section>
  );
}

const formSchema = z.object({
  username: z.string().min(3, "Username must be at least 3 characters").max(50),
  notificationsEnabled: z.boolean(),
  syncData: z.boolean(),
});

function FormGallery() {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      username: "",
      notificationsEnabled: false,
      syncData: true,
    },
  });

  const onSubmit = (values: z.infer<typeof formSchema>) => {
    toast("Form Submitted Successfully!", {
      variant: "success",
      description: `Username: ${values.username}`,
    });
  };

  return (
    <section className="flex flex-col gap-6 w-full">
      <Text variant="caption">Form System & Validation</Text>

      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="flex flex-col gap-6"
        >
          <FormGroup
            title="User Credentials"
            description="Setup your basic profile"
          >
            <FormField
              control={form.control}
              name="username"
              render={({ field }) => (
                <FormItem>
                  <FormLabel required>Username</FormLabel>
                  <FormControl>
                    <TextInput placeholder="Enter unique username" {...field} />
                  </FormControl>
                  <FormDescription>
                    This will be your visible display name.
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
          </FormGroup>

          <FormGroup title="Preferences">
            <FormField
              control={form.control}
              name="notificationsEnabled"
              render={({ field }) => (
                <FormItem layout="horizontal">
                  <FormLabel>Push Notifications</FormLabel>
                  <FormControl>
                    <Switch checked={field.value} onChange={field.onChange} />
                  </FormControl>
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="syncData"
              render={({ field }) => (
                <FormItem layout="horizontal">
                  <FormLabel>Cloud Backups</FormLabel>
                  <FormControl>
                    <Switch checked={field.value} onChange={field.onChange} />
                  </FormControl>
                  <FormDescription>
                    Backups use data on cellular.
                  </FormDescription>
                </FormItem>
              )}
            />
          </FormGroup>

          <Button type="submit" variant="primary">
            Save Changes
          </Button>
        </form>
      </Form>
    </section>
  );
}

function SelectGallery() {
  const [font, setFont] = useState("amiri");
  const [haptic, setHaptic] = useState("medium");

  return (
    <section className="flex flex-col gap-6 w-full">
      <Text variant="caption">Advanced Selectors (Mobile Native)</Text>
      
      <div className="flex flex-col gap-4">
        {/* Arabic Font Picker */}
        <div className="flex flex-col gap-2">
          <Text variant="body" weight="semibold">Arabic Font Selection</Text>
          <Select value={font} onValueChange={setFont}>
            <SelectTrigger>
              <SelectValue placeholder="Choose Font" />
            </SelectTrigger>
            <SelectContent title="Arabic Typography" description="Select the font style for your daily zikr.">
              <SelectItem 
                value="amiri" 
                label="Amiri" 
                description="Classic Quranic typography with high legibility."
                preview={<span className="text-xl font-serif">س</span>}
              />
              <SelectItem 
                value="uthmanic" 
                label="Uthman Taha" 
                description="The standard script used in the Mushaf Madinah."
                preview={<span className="text-xl">س</span>}
              />
              <SelectItem 
                value="indopak" 
                label="Indo-Pak" 
                description="Common script style in South Asian regions."
                preview={<span className="text-xl">س</span>}
              />
            </SelectContent>
          </Select>
        </div>

        {/* Haptic Intensity Picker */}
        <div className="flex flex-col gap-2">
          <Text variant="body" weight="semibold">Haptic Feedback Intensity</Text>
          <Select value={haptic} onValueChange={setHaptic}>
            <SelectTrigger>
              <SelectValue placeholder="Intensity Level" />
            </SelectTrigger>
            <SelectContent title="Haptic Feedback" description="Control the tactile sensation of the counter tap.">
              <SelectItem 
                value="light" 
                label="Light" 
                description="Subtle, gentle vibration on each count."
              />
              <SelectItem 
                value="medium" 
                label="Medium" 
                description="Standard tactile response for clear feedback."
              />
              <SelectItem 
                value="heavy" 
                label="Heavy" 
                description="Strong, physical vibration for every tap."
              />
              <SelectItem 
                value="none" 
                label="Disabled" 
                description="Zero haptic feedback on counting."
              />
            </SelectContent>
          </Select>
        </div>
      </div>
    </section>
  );
}

function TimePickerGallery() {
  const [time, setTime] = useState({ hour: 5, minute: 30 });
  const [format, setFormat] = useState<"12h" | "24h">("12h");

  return (
    <section className="flex flex-col gap-6 w-full py-4">
      <div className="flex flex-col gap-1">
        <Text variant="caption">Time Picker (Minimalist Wheel)</Text>
        <div className="flex items-center justify-between">
          <Text variant="body" weight="semibold">Prayer Time Configuration</Text>
          <div className="flex items-center gap-3 bg-base-200/50 px-3 py-1.5 rounded-xl">
             <Text variant="caption" color={format === '12h' ? 'primary' : 'muted'}>12h</Text>
             <Switch 
                checked={format === '24h'} 
                onChange={(checked) => setFormat(checked ? '24h' : '12h')} 
             />
             <Text variant="caption" color={format === '24h' ? 'primary' : 'muted'}>24h</Text>
          </div>
        </div>
      </div>
      
      <Card variant="filled" className="bg-base-200/30">
        <TimePicker value={time} onChange={setTime} hourFormat={format} />
      </Card>

      <div className="flex items-center justify-between px-4">
        <Text variant="caption" color="subtle">Selected Time (Internal 24h)</Text>
        <Text variant="body" weight="bold" color="primary" className="text-xl">
          {time.hour.toString().padStart(2, '0')}:
          {time.minute.toString().padStart(2, '0')}
        </Text>
      </div>
    </section>
  );
}

function BottomNavGallery() {
  const [active, setActive] = useState("home");
  const [variant, setVariant] = useState<"bar" | "glass-dock">("glass-dock");

  const TABS: TabItem[] = [
    { id: "home", icon: <Home size={22} />, label: "Home", badge: 3 },
    { id: "stats", icon: <BarChart2 size={22} />, label: "Stats" },
    { id: "saved", icon: <BookOpen size={22} />, label: "Saved" },
    { id: "settings", icon: <Settings size={22} />, label: "Settings" },
  ];

  return (
    <section className="flex flex-col gap-3">
      <Text variant="caption">Bottom Navigation</Text>
      <div className="flex gap-2">
        <Button
          variant={variant === "bar" ? "primary" : "outline"}
          size="sm"
          onClick={() => setVariant("bar")}
        >
          Bar
        </Button>
        <Button
          variant={variant === "glass-dock" ? "primary" : "outline"}
          size="sm"
          onClick={() => setVariant("glass-dock")}
        >
          Glass Dock
        </Button>
      </div>
      <BottomNav
        variant={variant}
        tabs={TABS}
        activeTab={active}
        onTabChange={setActive}
      />
    </section>
  );
}

// Self-contained gallery — each drawer has its own useDrawer instance
function FABGallery() {
  return (
    <section className="flex flex-col gap-6">
      <Text variant="caption">Floating Action Button</Text>

      <div className="flex flex-wrap items-center gap-8">
        <div className="flex flex-col items-center gap-2">
          <Text variant="caption" color="subtle">
            Primary Circle
          </Text>
          <FAB icon={<Plus size={24} />} />
        </div>

        <div className="flex flex-col items-center gap-2">
          <Text variant="caption" color="subtle">
            Secondary Squircle
          </Text>
          <FAB
            icon={<Star size={24} />}
            variant="secondary"
            shape="squircle"
            size="lg"
          />
        </div>

        <div className="flex flex-col items-center gap-2">
          <Text variant="caption" color="subtle">
            Glass Surface
          </Text>
          <FAB icon={<Search size={22} />} variant="surface" />
        </div>

        <div className="flex flex-col items-center gap-2 w-full">
          <Text variant="caption" color="subtle" className="w-full text-center">
            Extended FAB
          </Text>
          <FAB icon={<Plus size={24} />} label="Create New Tasbeeh" size="lg" />
        </div>
      </div>
    </section>
  );
}

function DrawerGallery() {
  const basic = useDrawer();
  const snapped = useDrawer();
  const action = useDrawer();

  return (
    <section className="flex flex-col gap-4">
      <Text variant="caption">Drawer (Bottom Sheet)</Text>

      <Button variant="outline" onClick={basic.open}>
        Single Snap — 50%
      </Button>
      <Button variant="primary" onClick={snapped.open}>
        Multi Snap — 25% / 60% / 95%
      </Button>
      <Button variant="ghost" onClick={action.open}>
        Action Sheet — 40%
      </Button>

      {/* Single snap, content only */}
      <Drawer
        isOpen={basic.isOpen}
        onClose={basic.close}
        snapPoints={["50%"]}
        title="Basic Bottom Sheet"
        description="Single snap point at 50%. Drag handle down to dismiss."
      >
        <div className="flex flex-col gap-4 py-2">
          <Text variant="body" color="subtle">
            The sheet sits at 50% of screen height. Drag the handle down past
            the close threshold or flick it to dismiss.
          </Text>
          <Button variant="primary" onClick={basic.close}>
            Close
          </Button>
        </div>
      </Drawer>

      {/* Multi-snap — 25% / 60% / 95% */}
      <Drawer
        isOpen={snapped.isOpen}
        onClose={snapped.close}
        snapPoints={["25%", "60%", "95%"]}
        initialSnap={1}
        title="Prayer Settings"
        description="Drag the handle to snap between 25%, 60%, and 95%."
      >
        <div className="flex flex-col gap-5 py-2">
          <Switch
            checked={false}
            onChange={() => {}}
            label="Enable streak reminders"
            color="primary"
          />
          <Switch
            checked={true}
            onChange={() => {}}
            label="Haptic feedback on count"
            color="success"
          />
          <Switch
            checked={false}
            onChange={() => {}}
            label="Auto-advance tasbeeh"
            color="secondary"
          />
          <Switch
            checked={true}
            onChange={() => {}}
            label="Daily Islamic quote"
            color="accent"
          />
          <Switch
            checked={false}
            onChange={() => {}}
            label="Vibrate on milestone"
            color="warning"
          />
          <div className="pt-2">
            <Button variant="primary" onClick={snapped.close}>
              Save Settings
            </Button>
          </div>
        </div>
      </Drawer>

      {/* Action sheet — fixed at 40% */}
      <Drawer
        isOpen={action.isOpen}
        onClose={action.close}
        snapPoints={["40%"]}
        title="Share Tasbeeh"
        description="Choose how to share your count."
      >
        <div className="flex flex-col gap-3 py-2">
          {["Copy link", "Share via WhatsApp", "Export as image", "Cancel"].map(
            (item) => (
              <button
                key={item}
                onClick={action.close}
                className={`w-full text-left px-4 py-3 rounded-xl text-sm font-medium transition-colors ${
                  item === "Cancel"
                    ? "text-error bg-error/10 hover:bg-error/15"
                    : "bg-base-content/5 hover:bg-base-content/10 text-base-content"
                }`}
              >
                {item}
              </button>
            ),
          )}
        </div>
      </Drawer>
    </section>
  );
}

export default function TestScreen() {
  const { theme, toggleTheme } = useTheme();
  const [switches, setSwitches] = useState({
    notifications: true,
    darkMode: false,
    streak: true,
    vibration: false,
  });

  const handleRefresh = async () => {
    // Simulate API delay
    await new Promise((resolve) => setTimeout(resolve, 2000));
    toast("Sync Successful", {
      variant: "success",
      description: "Design system state is up to date.",
    });
  };

  return (
    <div className="flex flex-col gap-1 pb-20">
      <Header
        title="Test Screen"
        right={
          <button
            onClick={toggleTheme}
            className="text-xs font-bold uppercase tracking-widest px-3 py-1 bg-base-content/5 rounded-lg"
          >
            {theme === "light" ? "Dark" : "Light"}
          </button>
        }
      />

      <PullToRefresh onRefresh={handleRefresh}>
        <div className="flex flex-col gap-12 py-12 px-5">
          {/* ── Calendar & Heatmap ──────────── */}
          <CalendarGallery />

          <hr className="border-base-content/5" />

          {/* ── Buttons ──────────────────────── */}
          <section className="flex flex-col gap-8">
            <Text variant="caption">Button Primitives</Text>

            <div className="flex flex-col gap-4">
              <Button variant="primary">Primary Button</Button>
              <Button variant="secondary" leftIcon={<Plus size={18} />}>
                Secondary with Icon
              </Button>
              <Button variant="outline" rightIcon={<ChevronRight size={18} />}>
                Outline Action
              </Button>
              <Button
                variant="ghost"
                color="error"
                leftIcon={<Trash2 size={18} />}
              >
                Destructive Ghost
              </Button>
            </div>

            <Text variant="caption">Social Authentication</Text>
            <div className="flex flex-col gap-3">
              <Button variant="google" className="w-full shadow-sm">
                Continue with Google
              </Button>
              <Button variant="apple" className="w-full">
                Continue with Apple
              </Button>
            </div>

            <Text variant="caption">Button Sizes & Loading</Text>
            <div className="flex items-center gap-4 flex-wrap">
              <Button size="sm">Small</Button>
              <Button size="md">Medium</Button>
              <Button size="lg">Large</Button>
              <Button isLoading>Loading</Button>
            </div>
          </section>

          <hr className="border-base-content/5" />

          {/* ── Badges ───────────────────────── */}
          <section className="flex flex-col gap-4">
            <Text variant="caption">Badge Primitive</Text>
            <div className="flex flex-wrap gap-3">
              <Badge variant="primary">New</Badge>
              <Badge variant="success">Completed</Badge>
              <Badge variant="warning">Ongoing</Badge>
              <Badge variant="error" size="sm">
                Urgent
              </Badge>
              <Badge variant="neutral">Draft</Badge>
              <Badge variant="secondary">Update</Badge>
            </div>
          </section>

          <hr className="border-base-content/5" />

          {/* ── Avatars ──────────────────────── */}
          <section className="flex flex-col gap-6">
            <Text variant="caption">Avatar Primitive</Text>
            <div className="flex items-center gap-6">
              <Avatar
                src="https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=128&h=128&fit=crop"
                name="Dilnawaz Khan"
                size="lg"
                status="online"
              />
              <Avatar name="Zameer" size="md" status="away" />
              <Avatar size="sm" status="offline" name="D" />
            </div>

            <Text variant="caption">Avatar Group (Squircle)</Text>
            <AvatarGroup
              size="lg"
              max={3}
              total={12003}
              avatars={[
                {
                  src: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=128&h=128&fit=crop",
                  name: "Sarah",
                },
                {
                  src: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=128&h=128&fit=crop",
                  name: "Alex",
                },
                {
                  src: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=128&h=128&fit=crop",
                  name: "Maria",
                },
              ]}
            />

            <Text variant="caption">Avatar Group (Circle)</Text>
            <AvatarGroup
              size="lg"
              shape="circle"
              max={3}
              total={12003}
              avatars={[
                {
                  src: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=128&h=128&fit=crop",
                  name: "Sarah",
                },
                {
                  src: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=128&h=128&fit=crop",
                  name: "Alex",
                },
                {
                  src: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=128&h=128&fit=crop",
                  name: "Maria",
                },
              ]}
            />
          </section>

          <hr className="border-base-content/5" />

          {/* ── Indicators ───────────────────── */}
          <section className="flex flex-col gap-6">
            <Text variant="caption">Dot (Status)</Text>
            <div className="flex items-center gap-4">
              <Indicator variant="dot" color="success" size="sm" />
              <Indicator variant="dot" color="success" />
              <Indicator variant="dot" color="success" size="lg" />
              <Indicator variant="dot" color="error" />
              <Indicator variant="dot" color="warning" />
              <Indicator variant="dot" color="primary" />
              <Indicator variant="dot" color="neutral" />
            </div>

            <Text variant="caption">Pulse (Live / Active)</Text>
            <div className="flex items-center gap-6">
              <Indicator variant="pulse" color="success" size="sm" />
              <Indicator variant="pulse" color="error" />
              <Indicator variant="pulse" color="primary" size="lg" />
              <div className="flex items-center gap-2">
                <Indicator variant="pulse" color="error" size="sm" />
                <Text variant="body">Live Session</Text>
              </div>
            </div>

            <Text variant="caption">Badge (Count Overlay)</Text>
            <div className="flex items-center gap-8">
              <Indicator variant="badge" color="error" count={3} size="sm">
                <Avatar size="md" name="Zameer" />
              </Indicator>
              <Indicator
                variant="badge"
                color="primary"
                count={128}
                maxCount={99}
                size="sm"
              >
                <Avatar
                  size="md"
                  src="https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=128&h=128&fit=crop"
                  name="Dilnawaz"
                />
              </Indicator>
            </div>
          </section>

          <hr className="border-base-content/5" />

          {/* ── Switch ─────────────────────── */}
          <section className="flex flex-col gap-6">
            <Text variant="caption">Solid (Default)</Text>
            <div className="flex flex-col gap-4">
              <Switch
                checked={switches.notifications}
                onChange={(v) =>
                  setSwitches((s) => ({ ...s, notifications: v }))
                }
                label="Push Notifications"
              />
              <Switch
                checked={switches.streak}
                onChange={(v) => setSwitches((s) => ({ ...s, streak: v }))}
                label="Streak Reminders"
                color="success"
              />
              <Switch
                checked={switches.vibration}
                onChange={(v) => setSwitches((s) => ({ ...s, vibration: v }))}
                label="Haptic Feedback"
                disabled
              />
            </div>

            <Text variant="caption">With Icons (iOS-style)</Text>
            <div className="flex flex-col gap-4">
              <Switch
                checked={switches.notifications}
                onChange={(v) =>
                  setSwitches((s) => ({ ...s, notifications: v }))
                }
                label="Push Notifications"
                withIcons
              />
              <Switch
                checked={switches.streak}
                onChange={(v) => setSwitches((s) => ({ ...s, streak: v }))}
                label="Streak Reminders"
                color="success"
                withIcons
              />
              <Switch
                checked={switches.darkMode}
                onChange={(v) => setSwitches((s) => ({ ...s, darkMode: v }))}
                label="Dark Mode"
                color="neutral"
                withIcons
              />
            </div>

            <Text variant="caption">Outlined Variant</Text>
            <div className="flex flex-col gap-4">
              <Switch
                checked={switches.notifications}
                onChange={(v) =>
                  setSwitches((s) => ({ ...s, notifications: v }))
                }
                label="Push Notifications"
                variant="outlined"
              />
              <Switch
                checked={switches.streak}
                onChange={(v) => setSwitches((s) => ({ ...s, streak: v }))}
                label="Streak Reminders"
                color="success"
                variant="outlined"
              />
            </div>

            <Text variant="caption">Sizes</Text>
            <div className="flex items-center gap-4">
              <Switch checked size="xs" onChange={() => {}} />
              <Switch checked size="sm" onChange={() => {}} />
              <Switch checked size="md" onChange={() => {}} />
              <Switch checked size="lg" onChange={() => {}} />
              <Switch checked size="xl" onChange={() => {}} />
            </div>
          </section>

          <hr className="border-base-content/5" />

          {/* ── Checkbox ──────────────────── */}
          <section className="flex flex-col gap-6">
            <Text variant="caption">Checkbox (Controlled)</Text>
            <div className="flex flex-col gap-4">
              <Checkbox
                checked={switches.notifications}
                onChange={(v) =>
                  setSwitches((s) => ({ ...s, notifications: v }))
                }
                label="I agree to the terms"
              />
              <Checkbox
                checked={switches.streak}
                onChange={(v) => setSwitches((s) => ({ ...s, streak: v }))}
                label="Enable streak tracking"
                color="success"
              />
              <Checkbox
                checked={switches.darkMode}
                onChange={(v) => setSwitches((s) => ({ ...s, darkMode: v }))}
                label="Receive reminders"
                color="error"
              />
              <Checkbox
                checked={false}
                onChange={() => {}}
                label="Indeterminate state"
                indeterminate
              />
              <Checkbox
                checked={false}
                onChange={() => {}}
                label="Disabled"
                disabled
              />
            </div>

            <Text variant="caption">Colors</Text>
            <div className="flex items-center gap-3">
              <Checkbox checked onChange={() => {}} color="primary" />
              <Checkbox checked onChange={() => {}} color="secondary" />
              <Checkbox checked onChange={() => {}} color="accent" />
              <Checkbox checked onChange={() => {}} color="success" />
              <Checkbox checked onChange={() => {}} color="warning" />
              <Checkbox checked onChange={() => {}} color="error" />
              <Checkbox checked onChange={() => {}} color="neutral" />
            </div>

            <Text variant="caption">Sizes</Text>
            <div className="flex items-center gap-4">
              <Checkbox checked onChange={() => {}} size="xs" />
              <Checkbox checked onChange={() => {}} size="sm" />
              <Checkbox checked onChange={() => {}} size="md" />
              <Checkbox checked onChange={() => {}} size="lg" />
              <Checkbox checked onChange={() => {}} size="xl" />
            </div>
          </section>

          <hr className="border-base-content/5" />

          {/* ── TextInput ──────────────────── */}
          <section className="flex flex-col gap-5">
            <Text variant="caption">Text Input</Text>

            <TextInput
              label="Full Name"
              placeholder="Dilnawaz Khan"
              hint="This will appear on your profile"
            />

            <TextInput
              label="Email"
              type="email"
              placeholder="you@example.com"
              leftIcon={<Mail size={16} />}
            />

            <TextInput
              label="Search"
              placeholder="Search tasbeehs..."
              leftIcon={<Search size={16} />}
              variant="ghost"
            />

            <TextInput
              label="Password"
              type="password"
              placeholder="••••••••"
              leftIcon={<Lock size={16} />}
              rightIcon={<Eye size={16} />}
              color="primary"
            />

            <TextInput
              label="Username"
              placeholder="@handle"
              error="This username is already taken"
            />

            <Text variant="caption">Sizes</Text>
            <div className="flex flex-col gap-3">
              <TextInput placeholder="Extra small" size="xs" />
              <TextInput placeholder="Small" size="sm" />
              <TextInput placeholder="Medium (default)" size="md" />
              <TextInput placeholder="Large" size="lg" />
              <TextInput placeholder="Extra large" size="xl" />
            </div>
          </section>

          <hr className="border-base-content/5" />

          {/* ── Card ───────────────────── */}
          <section className="flex flex-col gap-5">
            <Text variant="caption">Card Variants</Text>

            <Card variant="elevated">
              <Text variant="body" weight="semibold">
                Elevated Card
              </Text>
              <Text variant="body" color="subtle">
                Shadow lifts it off the surface. Great for primary content
                blocks.
              </Text>
            </Card>

            <Card variant="outlined">
              <Text variant="body" weight="semibold">
                Outlined Card
              </Text>
              <Text variant="body" color="subtle">
                Subtle border, no shadow. Works well on elevated backgrounds.
              </Text>
            </Card>

            <Card variant="ghost">
              <Text variant="body" weight="semibold">
                Ghost Card
              </Text>
              <Text variant="body" color="subtle">
                Tinted fill, no border or shadow. Blends into the page.
              </Text>
            </Card>

            <Card variant="filled">
              <Text variant="body" weight="semibold">
                Filled Card
              </Text>
              <Text variant="body" color="subtle">
                Base-200 background. Slightly more opaque than ghost.
              </Text>
            </Card>

            <Text variant="caption">Radius Scale</Text>
            <div className="flex flex-col gap-3">
              <Card variant="outlined" radius="sm" padding="sm">
                <Text variant="body" color="subtle">
                  radius sm — 14px
                </Text>
              </Card>
              <Card variant="outlined" radius="md" padding="sm">
                <Text variant="body" color="subtle">
                  radius md — 20px
                </Text>
              </Card>
              <Card variant="outlined" radius="lg" padding="sm">
                <Text variant="body" color="subtle">
                  radius lg — 26px
                </Text>
              </Card>
              <Card variant="outlined" radius="xl" padding="sm">
                <Text variant="body" color="subtle">
                  radius xl — 32px
                </Text>
              </Card>
            </div>

            <Text variant="caption">Pressable Card</Text>
            <Card
              variant="elevated"
              radius="lg"
              pressable
              onClick={() => alert("Card tapped!")}
            >
              <div className="flex items-center gap-3">
                <Avatar name="Dilnawaz Khan" size="md" />
                <div>
                  <Text variant="body" weight="semibold">
                    Dilnawaz Khan
                  </Text>
                  <Text variant="body" color="subtle">
                    Tap me — I'm interactive
                  </Text>
                </div>
              </div>
            </Card>

            <Text variant="caption">No Padding</Text>
            <Card variant="elevated" padding="none" radius="lg">
              <img
                src="https://images.unsplash.com/photo-1472289065668-ce650ac443d2?w=600&h=200&fit=crop"
                className="w-full h-32 object-cover"
                alt="card cover"
              />
              <div className="p-5">
                <Text variant="body" weight="semibold">
                  Image Card
                </Text>
                <Text variant="body" color="subtle">
                  padding=none lets content bleed to edges. Great for media.
                </Text>
              </div>
            </Card>
          </section>

          <hr className="border-base-content/5" />

          {/* ── Drawer ─────────────────── */}
          <DrawerGallery />

          <hr className="border-base-content/5" />

          {/* ── Bottom Navigation ──────── */}
          <BottomNavGallery />

          {/* ── Stats ────────────────── */}
          <StatsGallery />

          <hr className="border-base-content/5" />

          {/* ── Counter ────────────────── */}
          <CounterGallery />

          <hr className="border-base-content/5" />

          {/* ── Progress Ring ────────── */}
          <ProgressRingGallery />

          <hr className="border-base-content/5" />

          {/* ── List & ListItem ────────── */}
          <ListGallery />

          <hr className="border-base-content/5" />

          {/* ── FAB ───────────────────── */}
          <FABGallery />

          <hr className="border-base-content/5" />

          {/* ── Chat UI ───────────────── */}
          <ChatGallery />

          <hr className="border-base-content/5" />

          {/* ── Skeleton Loaders ──────── */}
          <SkeletonGallery />

          <hr className="border-base-content/5" />

          {/* ── Dialog Overlays ───────── */}
          <DialogGallery />

          <hr className="border-base-content/5" />

          {/* ── Toast Notifications ─────── */}
          <ToastGallery />

          <hr className="border-base-content/5" />

          {/* ── Empty States ────────────── */}
          <EmptyStateGallery />

          <hr className="border-base-content/5" />

          {/* ── Accordions ──────────────── */}
          <AccordionGallery />

          <hr className="border-base-content/5" />

          {/* ── Forms System ──────────────── */}
          <FormGallery />

          <hr className="border-base-content/5" />

          {/* ── Selectors ─────────────────── */}
          <SelectGallery />

          <hr className="border-base-content/5" />

          {/* ── Time Picker ────────────────── */}
          <TimePickerGallery />

          <hr className="border-base-content/5" />

          {/* ── Typography ───────────────── */}

          <section className="flex flex-col gap-8 pb-20">
            <Text variant="caption">Typography Primitive</Text>

            <Text variant="display-arabic" leading="tight">
              سُبْحَانَ اللَّهِ
            </Text>

            <Text variant="display-urdu" leading="tight">
              خودی کو کر بلند اتنا کہ ہر تقدیر سے پہلے
            </Text>

            <Text variant="counter" className="text-5xl">
              0123456789
            </Text>

            <Text variant="heading" weight="bold">
              Heading Level
            </Text>

            <div className="flex flex-col gap-4">
              <Text variant="body">Body (Base)</Text>
              <Text variant="body" color="muted">
                Body (Muted)
              </Text>
              <Text variant="body" color="subtle">
                Body (Subtle)
              </Text>
            </div>

            <Text variant="caption">System Caption</Text>
          </section>
        </div>
      </PullToRefresh>

      {/* ── Global Portals ── */}
      <Toaster />
    </div>
  );
}
