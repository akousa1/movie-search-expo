import { useEffect, useState } from 'react';
import { useLocalSearchParams, Stack } from 'expo-router';
import { View, Text, Image, ScrollView, ActivityIndicator } from 'react-native';

const TMDB_API_KEY = '2d9c7c273083b2614a46f2c47cb0d0c4';

type MovieDetails = {
    title: string;
    overview: string;
    release_date: string;
    poster_path: string | null;
    backdrop_path: string | null;
    runtime: number;
    genres: { id: number; name: string }[];
};

export default function MovieDetailsScreen() {
    const { movieId } = useLocalSearchParams();
    const [movie, setMovie] = useState<MovieDetails | null>(null);
    const [loading, setLoading] = useState(true);
    console.log('movieId from params:', movieId);

    useEffect(() => {
        if (!movieId) return;

        fetch(`https://api.themoviedb.org/3/movie/${movieId}?api_key=${TMDB_API_KEY}`)
            .then((res) => res.json())
            .then((data) => {
                setMovie(data);
                setLoading(false);
            });
    }, [movieId]);



    if (loading) {
        return (
            <View className="flex-1 justify-center items-center">
                <ActivityIndicator size="large" />
            </View>
        );
    }

    if (!movie) {
        return (
            <View className="flex-1 justify-center items-center">
                <Text>Movie details not found.</Text>
            </View>
        );
    }

    return (
        <ScrollView className="flex-1 bg-white">
            <Stack.Screen options={{ title: movie.title }} />

            {movie.backdrop_path && (
                <Image
                    source={{ uri: `https://image.tmdb.org/t/p/w500${movie.backdrop_path}` }}
                    className="w-full h-60"
                    resizeMode="cover"
                />
            )}

            <View className="p-4">
                <Text className="text-2xl font-bold mb-2">{movie.title}</Text>
                <Text className="text-gray-500 mb-1">Release Date: {movie.release_date}</Text>
                <Text className="text-gray-500 mb-1">Runtime: {movie.runtime} minutes</Text>

                <Text className="text-gray-700 my-3">{movie.overview}</Text>

                <Text className="font-semibold mb-1">Genres:</Text>
                <View className="flex-row flex-wrap gap-2">
                    {movie.genres.map((genre) => (
                        <Text
                            key={genre.id}
                            className="bg-gray-200 px-2 py-1 rounded text-sm mr-2 mb-2"
                        >
                            {genre.name}
                        </Text>
                    ))}
                </View>
            </View>
        </ScrollView>
    );
}
