import {Stack} from "expo-router";
import {CVProvider} from "../context/CVContext";

export default function RootLayout() {
  return(
    <CVProvider>
      <Stack
        screenOptions= {{
          headerStyle: {
            backgroundColor: "#3498db"
          },
          headerTintColor: "#fff",
          headerTitleStyle: {
            fontWeight: "bold"
          }
        }}>
          <Stack.Screen
            name= "index"
            options= {{
              title: "Crear CV",
              headerShown: true
            }}
          />
          <Stack.Screen
            name= "personal-info"
            options= {{
              title: "Informacion Personal",
            }}
          />
          <Stack.Screen
            name= "experience"
            options= {{
              title: "Experiencia laboral",
            }}
          />
          <Stack.Screen
            name= "education"
            options= {{
              title: "Educacion",
            }}
          />
          <Stack.Screen
            name= "preview"
            options= {{
              title: "Vista previa",
              presentation: "modal"
            }}
          />
        </Stack>
    </CVProvider>
  );
}