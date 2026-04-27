import { useState } from "react";
import { TasbeehItem } from "../components/TasbeehItem";
import { TasbeehForm } from "../components/TasbeehForm";
import { Text } from "@/design-system/atoms/Text";
import { Button } from "@/design-system/atoms/Button";
import { useTasbeehStore } from "@/store/tasbeeh/useTasbeehStore";

/**
 * TasbeehScreen
 * 
 * Production Version: Handles CRUD operations, loading states, 
 * and orchestration of the Tasbeeh creation flow.
 */
export const TasbeehScreen = () => {
  const { tasbeehList, increment, reset, deleteTasbeeh, addTasbeeh, loading } = useTasbeehStore();
  const [showForm, setShowForm] = useState(false);

  if (loading) {
    return (
      <div style={{ padding: 16, textAlign: "center" }}>
        <Text variant="body" color="secondary">Loading your session...</Text>
      </div>
    );
  }

  return (
    <div style={{ padding: 16, display: "flex", flexDirection: "column", gap: 16 }}>
      
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end", marginBottom: 8 }}>
        <div>
          <Text variant="heading">Tasbeeh</Text>
          <Text variant="body" color="secondary">Your daily zikr session</Text>
        </div>
        {!showForm && (
          <Button size="sm" onClick={() => setShowForm(true)}>+ Add</Button>
        )}
      </div>

      {showForm && (
        <TasbeehForm 
          onSubmit={(values) => {
            addTasbeeh(values);
            setShowForm(false);
          }}
          onCancel={() => setShowForm(false)}
        />
      )}

      <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
        {tasbeehList.length === 0 && !showForm ? (
          <div style={{ padding: "40px 20px", textAlign: "center" }}>
            <Text variant="body" color="secondary">
              No Tasbeeh yet. Start adding your daily zikr.
            </Text>
          </div>
        ) : (
          tasbeehList.map((item) => (
            <TasbeehItem
              key={item.id}
              title={item.title}
              target={item.target}
              count={item.count}
              onIncrement={() => increment(item.id)}
              onReset={() => reset(item.id)}
              onDelete={() => deleteTasbeeh(item.id)}
            />
          ))
        )}
      </div>
    </div>
  );
};
