import { NavigationButton } from "@/components/NavigationButton";
import { PersonalInfo } from "@/types/cv.types";
import { useRouter } from "expo-router";
import { useEffect } from "react";
import { Alert, ScrollView, StyleSheet, View } from "react-native";
import { Controller, useForm } from "react-hook-form";
import { InputField } from "../components/inputField";
import { useCVContext } from "../context/CVContext";

export default function PersonalInfoScreeen(){
    const router = useRouter()
    const {cvData, updatePersonalInfo} = useCVContext();

    const { control, handleSubmit, reset } = useForm<PersonalInfo>({
        defaultValues: cvData.personalInfo,
        mode: "onChange",
    });

    useEffect(() => {
        reset(cvData.personalInfo);
    }, [cvData.personalInfo, reset]);

    const handleSave = (formData: PersonalInfo) => {
        updatePersonalInfo(formData);
        Alert.alert("Exito", "Informacion guardada correctamente",[
            {text: "OK", onPress: () => router.back()}
        ]);
    };

    return(
        <ScrollView style={styles.container}>
            <View style= {styles.content}>
                <Controller
                control={control}
                name="fullName"
                rules={{
                    validate: (value) =>
                        value.trim().length > 0 || "El nombre es obligatorio",
                }}
                render={({field, fieldState}) => (
                    <InputField
                    label="Nombre Completo *"
                    placeholder="Juan Perez"
                    value={field.value}
                    onChangeText={field.onChange}
                    onBlur={field.onBlur}
                    error={fieldState.error?.message}
                    />
                )}
                />
                <Controller
                control={control}
                name="email"
                rules={{
                    validate: (value) => {
                        if (!value.trim()) return "El email es obligatorio";
                        return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value.trim())
                            || "Ingresa un email válido";
                    },
                }}
                render={({field, fieldState}) => (
                    <InputField
                    label="Email *"
                    placeholder="juan@email.com"
                    value={field.value}
                    onChangeText={field.onChange}
                    onBlur={field.onBlur}
                    keyboardType="email-address"
                    autoCapitalize="none"
                    error={fieldState.error?.message}
                    />
                )}
                />
                <Controller
                control={control}
                name="phone"
                rules={{
                    validate: (value) => {
                        if (!value.trim()) return true;
                        const digitCount = value.replace(/\D/g, "").length;
                        return (
                            (/^[+]?[\d\s().-]+$/.test(value.trim()) &&
                                digitCount >= 7 &&
                                digitCount <= 15) ||
                            "Ingresa un teléfono válido"
                        );
                    },
                }}
                render={({field, fieldState}) => (
                    <InputField
                    label="Telefono"
                    placeholder="+593 99 999 9999"
                    value={field.value}
                    onChangeText={field.onChange}
                    onBlur={field.onBlur}
                    keyboardType="phone-pad"
                    error={fieldState.error?.message}
                    />
                )}
                />
                <Controller
                control={control}
                name="location"
                render={({field}) => (
                    <InputField
                    label="Ubicacion"
                    placeholder="Quito, Ecuador"
                    value={field.value}
                    onChangeText={field.onChange}
                    onBlur={field.onBlur}
                    />
                )}
                />
                <Controller
                control={control}
                name="summary"
                render={({field}) => (
                    <InputField
                    label="Resumen Personal"
                    placeholder="Describe brevemente tu perfil profesional..."
                    value={field.value}
                    onChangeText={field.onChange}
                    onBlur={field.onBlur}
                    multiline
                    numberOfLines={4}
                    style={{height: 100, textAlignVertical: "top"}}
                    />
                )}
                />

                <NavigationButton title="Guardar" onPress={handleSubmit(handleSave)}/>

                <NavigationButton title="Cancelar" onPress={() => router.back()} variant="secondary"/>
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
        padding: 20
    }
})
