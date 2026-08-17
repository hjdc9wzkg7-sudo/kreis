import { useMemo, useState } from "react";
import { StyleSheet, TextInput, View } from "react-native";

import { upcomingDayOptions } from "../domain/matching";
import type { Circle, Meetup } from "../domain/types";
import { colors } from "../theme/tokens";
import { ActionRow, Body, Button, Card, Chip, Title, fieldStyle } from "./ui";

const TIME_OPTIONS = ["10:00", "12:00", "14:00", "16:00", "17:00", "18:00", "19:00", "20:00"] as const;

export function ScheduleNextCard({
  circle,
  meetup,
  onSave,
  onCancel,
}: {
  circle: Circle;
  meetup?: Meetup;
  onSave: (input: { title: string; date: string; time: string; location: string }) => void;
  onCancel?: () => void;
}) {
  const days = useMemo(() => {
    const options = upcomingDayOptions(8);
    if (meetup?.date && !options.some((item) => item.date === meetup.date)) {
      const label = new Date(`${meetup.date}T12:00:00`).toLocaleDateString("de-DE", {
        weekday: "short",
        day: "numeric",
        month: "numeric",
      });
      return [{ date: meetup.date, label }, ...options];
    }
    return options;
  }, [meetup?.date]);
  const times = useMemo(() => {
    if (meetup?.time && !(TIME_OPTIONS as readonly string[]).includes(meetup.time)) {
      return [meetup.time, ...TIME_OPTIONS];
    }
    return [...TIME_OPTIONS];
  }, [meetup?.time]);
  const editing = Boolean(meetup);
  const [title, setTitle] = useState(meetup?.title ?? circle.name);
  const [date, setDate] = useState(meetup?.date ?? days[0]?.date ?? "");
  const [time, setTime] = useState(meetup?.time ?? "17:00");
  const [location, setLocation] = useState(meetup?.location ?? "");
  const ready = title.trim().length > 1 && location.trim().length > 3 && Boolean(date);
  const save = () =>
    onSave({
      title: title.trim(),
      date,
      time,
      location: location.trim(),
    });

  return (
    <Card>
      <Title>{editing ? "Treffen ändern" : "Nächstes Treffen festlegen"}</Title>
      <Body muted style={styles.lead}>
        Für {circle.name}. Den Treffpunkt sehen die anderen erst nach der Zusage.
      </Body>

      <TextInput
        value={title}
        onChangeText={setTitle}
        placeholder="Worum geht's?"
        placeholderTextColor={colors.muted}
        style={styles.input}
        accessibilityLabel="Titel des Treffens"
      />

      <View style={styles.wrap}>
        {days.map((option) => (
          <Chip
            key={option.date}
            label={option.label}
            selected={date === option.date}
            onPress={() => setDate(option.date)}
          />
        ))}
      </View>
      <View style={styles.wrap}>
        {times.map((option) => (
          <Chip
            key={option}
            label={option}
            selected={time === option}
            onPress={() => setTime(option)}
          />
        ))}
      </View>

      <TextInput
        value={location}
        onChangeText={setLocation}
        placeholder="Treffpunkt"
        placeholderTextColor={colors.muted}
        style={styles.input}
        accessibilityLabel="Treffpunkt"
      />

      {onCancel ? (
        <ActionRow
          primary={<Button label="Speichern" disabled={!ready} onPress={save} />}
          secondary={<Button label="Abbrechen" variant="ghost" onPress={onCancel} />}
        />
      ) : (
        <Button label="Speichern" disabled={!ready} onPress={save} />
      )}
    </Card>
  );
}

const styles = StyleSheet.create({
  lead: { marginTop: 8, marginBottom: 12 },
  wrap: { flexDirection: "row", flexWrap: "wrap", gap: 8, marginBottom: 10 },
  input: {
    ...fieldStyle,
    marginBottom: 12,
  },
});
