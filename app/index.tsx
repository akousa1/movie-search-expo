import { useState } from 'react';
import { Stack, useRouter } from 'expo-router';
import { View, Text, TextInput, FlatList, Image, ActivityIndicator, TouchableOpacity } from 'react-native';

const TMDB_API_KEY = '2d9c7c273083b2614a46f2c47cb0d0c4';

type Movie = {
  id: number;
  title: string;
  release_date: string;
  poster_path: string | null;
  overview: string;
};

export default function App() {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<Movie[]>([]);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(false);
  const [loading, setLoading] = useState(false);
  const [loadingMore, setLoadingMore] = useState(false);

  const router = useRouter();

  const fetchMovies = async (searchText: string, pageToLoad = 1, append = false) => {
    if (!searchText) return;

    const encodedQuery = encodeURIComponent(searchText);
    const url = `https://api.themoviedb.org/3/search/movie?api_key=${TMDB_API_KEY}&query=${encodedQuery}&page=${pageToLoad}`;

    const res = await fetch(url);
    const json = await res.json();

    if (append) {
      setResults((prev) => [...prev, ...(json.results || [])]);
    } else {
      setResults(json.results || []);
    }

    setHasMore(json.page < json.total_pages);
    setPage(json.page);
  };

  const handleSearch = async (text: string) => {
    setQuery(text);
    setPage(1);
    setLoading(true);
    await fetchMovies(text, 1);
    setLoading(false);
  };

  const loadMore = async () => {
    if (!hasMore || loadingMore) return;

    setLoadingMore(true);
    await fetchMovies(query, page + 1, true);
    setLoadingMore(false);
  };

  return (
    <View className="flex-1 bg-white p-4">
      <Stack.Screen options={{ title: 'Movie Search' }} />

      <TextInput
        placeholder="Search movies..."
        className="border border-gray-300 p-2 rounded mb-4"
        value={query}
        onChangeText={handleSearch}
      />

      {loading ? (
        <ActivityIndicator size="large" className="mt-10" />
      ) : (
        <FlatList
          data={results}
          keyExtractor={(item) => item.id.toString()}
          onEndReached={loadMore}
          onEndReachedThreshold={0.5}
          ListFooterComponent={
            loadingMore ? <ActivityIndicator className="my-4" /> : null
          }
          renderItem={({ item }) => (
            <TouchableOpacity onPress={() => router.push(`/details/${item.id}`)}>
              <View className="flex-row mb-4">
                {item.poster_path ? (
                  <Image
                    source={{ uri: `https://image.tmdb.org/t/p/w92${item.poster_path}` }}
                    className="w-20 h-28 mr-3 rounded"
                  />
                ) : (
                  <View className="w-20 h-28 mr-3 bg-gray-200 rounded items-center justify-center">
                    <Text className="text-xs text-gray-500">No Image</Text>
                  </View>
                )}
                <View className="flex-1">
                  <Text className="text-lg font-bold">{item.title}</Text>
                  <Text className="text-sm text-gray-600">{item.release_date}</Text>
                  <Text numberOfLines={2} className="text-sm text-gray-500">
                    {item.overview}
                  </Text>
                </View>
              </View>
            </TouchableOpacity>
          )}
        />
      )}
    </View>
  );
}