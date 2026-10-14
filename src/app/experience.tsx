import { useRouter } from "expo-router";
import { useState } from "react";
import {
    Alert,
    Platform,
    ScrollView,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from "react-native";
import DateTimePicker, {
  DateTimePickerAndroid,
} from "@react-native-community/datetimepicker";
import { Controller, useForm } from "react-hook-form";
import { InputField } from "@/components/inputField";
import { NavigationButton } from "../components/NavigationButton";
import { useCVContext } from "@/context/CVContext";
import { Experience } from "../types/cv.types";

type DateField = "startDate" | "endDate";

const formatDate = (date: Date) => date.toLocaleDateString("es-ES");

const parseDate = (value: string) => {
  const match = /^(\d{2})\/(\d{2})\/(\d{4})$/.exec(value);

  if (!match) {
    return new Date();
  }

  return new Date(Number(match[3]), Number(match[2]) - 1, Number(match[1]));
};

export default function ExperienceScreen() {
  const router = useRouter();
  const { cvData, addExperience, deleteExperience } = useCVContext();
  const { control, handleSubmit, reset } = useForm<Omit<Experience, "id">>({
    defaultValues: {
      company: "",
      position: "",
      startDate: "",
      endDate: "",
      description: "",
    },
    mode: "onChange",
  });
  const [activeDatePicker, setActiveDatePicker] = useState<DateField | null>(
    null
  );

  const showDatePicker = (
    field: DateField,
    value: string,
    onChange: (value: string) => void
  ) => {
    if (Platform.OS === "android") {
      DateTimePickerAndroid.open({
        value: parseDate(value),
        mode: "date",
        onValueChange: (_event, selectedDate) => {
          onChange(formatDate(selectedDate));
        },
      });
      return;
    }

    setActiveDatePicker((current) => (current === field ? null : field));
  };

  const updateDate = (
    selectedDate: Date,
    onChange: (value: string) => void
  ) => {
    onChange(formatDate(selectedDate));
    setActiveDatePicker(null);
  };

  const handleAdd = (formData: Omit<Experience, "id">) => {
    const newExperience: Experience = {
      id: Date.now().toString(),
      ...formData,
    };

    addExperience(newExperience);
    reset({
      company: "",
      position: "",
      startDate: "",
      endDate: "",
      description: "",
    });

    Alert.alert("Éxito", "Experiencia agregada correctamente");
  };

  const handleDelete = (id: string) => {
    Alert.alert("Confirmar", "¿Estás seguro de eliminar esta experiencia?", [
      { text: "Cancelar", style: "cancel" },
      {
        text: "Eliminar",
        style: "destructive",
        onPress: () => deleteExperience(id),
      },
    ]);
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.content}>
        <Text style={styles.sectionTitle}>Agregar Nueva Experiencia</Text>

        <Controller
          control={control}
          name="company"
          rules={{
            validate: (value) =>
              value.trim().length > 0 || "La empresa es obligatoria",
          }}
          render={({ field, fieldState }) => (
            <InputField
              label="Empresa *"
              placeholder="Nombre de la empresa"
              value={field.value}
              onChangeText={field.onChange}
              onBlur={field.onBlur}
              error={fieldState.error?.message}
            />
          )}
        />

        <Controller
          control={control}
          name="position"
          rules={{
            validate: (value) =>
              value.trim().length > 0 || "El cargo es obligatorio",
          }}
          render={({ field, fieldState }) => (
            <InputField
              label="Cargo *"
              placeholder="Tu posición"
              value={field.value}
              onChangeText={field.onChange}
              onBlur={field.onBlur}
              error={fieldState.error?.message}
            />
          )}
        />

        {(["startDate", "endDate"] as const).map((field) => {
          const isStartDate = field === "startDate";
          const label = isStartDate ? "Fecha de Inicio *" : "Fecha de Fin";

          return (
            <Controller
              key={field}
              control={control}
              name={field}
              rules={
                isStartDate
                  ? {
                      validate: (value) =>
                        value.trim().length > 0 ||
                        "La fecha de inicio es obligatoria",
                    }
                  : undefined
              }
              render={({ field: dateField, fieldState }) => {
                if (Platform.OS === "web") {
                  return (
                    <InputField
                      label={label}
                      placeholder={
                        isStartDate
                          ? "Ej: Enero 2020"
                          : "Opcional; dejar vacío si trabajas aquí"
                      }
                      value={dateField.value}
                      onChangeText={dateField.onChange}
                      onBlur={dateField.onBlur}
                      error={fieldState.error?.message}
                    />
                  );
                }

                return (
                  <View style={styles.dateField}>
                    <Text style={styles.dateLabel}>{label}</Text>
                    <TouchableOpacity
                      style={[
                        styles.dateInput,
                        fieldState.error && styles.dateInputError,
                      ]}
                      onPress={() =>
                        showDatePicker(field, dateField.value, dateField.onChange)
                      }
                      accessibilityRole="button"
                      accessibilityLabel={label}
                    >
                      <Text
                        style={[
                          styles.dateInputText,
                          !dateField.value && styles.datePlaceholder,
                        ]}
                      >
                        {dateField.value ||
                          (isStartDate
                            ? "Seleccionar fecha"
                            : "Opcional; dejar vacío si trabajas aquí")}
                      </Text>
                    </TouchableOpacity>
                    {fieldState.error && (
                      <Text style={styles.errorText}>
                        {fieldState.error.message}
                      </Text>
                    )}
                    {Platform.OS === "ios" && activeDatePicker === field && (
                      <DateTimePicker
                        value={parseDate(dateField.value)}
                        mode="date"
                        display="inline"
                        onValueChange={(_event, selectedDate) =>
                          updateDate(selectedDate, dateField.onChange)
                        }
                        onDismiss={() => setActiveDatePicker(null)}
                      />
                    )}
                  </View>
                );
              }}
            />
          );
        })}

        <Controller
          control={control}
          name="description"
          render={({ field }) => (
            <InputField
              label="Descripción"
              placeholder="Describe tus responsabilidades y logros..."
              value={field.value}
              onChangeText={field.onChange}
              onBlur={field.onBlur}
              multiline
              numberOfLines={4}
              style={{ height: 100, textAlignVertical: "top" }}
            />
          )}
        />

        <NavigationButton
          title="Agregar Experiencia"
          onPress={handleSubmit(handleAdd)}
        />

        {cvData.experiences.length > 0 && (
          <>
            <Text style={styles.listTitle}>Experiencias Agregadas</Text>
            {cvData.experiences.map((exp) => (
              <View key={exp.id} style={styles.card}>
                <View style={styles.cardContent}>
                  <Text style={styles.cardTitle}>{exp.position}</Text>
                  <Text style={styles.cardSubtitle}>{exp.company}</Text>
                  <Text style={styles.cardDate}>
                    {exp.startDate} - {exp.endDate || "Actual"}
                  </Text>
                </View>
                <TouchableOpacity
                  style={styles.deleteButton}
                  onPress={() => handleDelete(exp.id)}
                >
                  <Text style={styles.deleteButtonText}>✕</Text>
                </TouchableOpacity>
              </View>
            ))}
          </>
        )}

        <NavigationButton
          title="Volver"
          onPress={() => router.back()}
          variant="secondary"
          style={{ marginTop: 16 }}
        />
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f5f5f5",
  },
  content: {
    padding: 20,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#2c3e50",
    marginBottom: 16,
  },
  dateField: {
    marginBottom: 16,
  },
  dateLabel: {
    fontSize: 16,
    fontWeight: "600",
    color: "#333",
    marginBottom: 8,
  },
  dateInput: {
    minHeight: 48,
    justifyContent: "center",
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 8,
    padding: 12,
    backgroundColor: "#fff",
  },
  dateInputError: {
    borderColor: "#e74c3c",
  },
  dateInputText: {
    fontSize: 16,
    color: "#333",
  },
  datePlaceholder: {
    color: "#999",
  },
  errorText: {
    color: "#e74c3c",
    fontSize: 12,
    marginTop: 4,
  },
  listTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: "#2c3e50",
    marginTop: 24,
    marginBottom: 12,
  },
  card: {
    backgroundColor: "#fff",
    borderRadius: 8,
    padding: 16,
    marginBottom: 12,
    flexDirection: "row",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  cardContent: {
    flex: 1,
  },
  cardTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: "#2c3e50",
    marginBottom: 4,
  },
  cardSubtitle: {
    fontSize: 14,
    color: "#7f8c8d",
    marginBottom: 4,
  },
  cardDate: {
    fontSize: 12,
    color: "#95a5a6",
  },
  deleteButton: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: "#e74c3c",
    justifyContent: "center",
    alignItems: "center",
  },
  deleteButtonText: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "bold",
  },
});
