import { Link } from "expo-router";
import { Text, View } from "react-native";

export default function Index() {
  return (
    <View className="flex-1 justify-center items-center content-center">
      <Text className="font-bold text-5xl text-dark-200">Hello</Text>
      <Link href={"/onboarding"} className="underline">
        Onboarding
      </Link>
      <Link
        href={{
          pathname: "/movie/[id]",
          params: { id: "avengers" },
        }}
        className="underline"
      >
        Movie
      </Link>
    </View>
  );
}
