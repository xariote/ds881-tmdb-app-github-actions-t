import { useLocalSearchParams } from 'expo-router';
import { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ActivityIndicator,
  ScrollView,
  FlatList,
  Pressable
} from 'react-native';
import { Image } from 'expo-image';
import { Link } from 'expo-router';
import { api } from '../../src/api/tmdb';

// Tipagens para os dados da API
interface ActorDetails {
  id: number;
  name: string;
  biography: string;
  profile_path: string | null;
  birthday: string | null;
  place_of_birth: string | null;
}

interface MovieCredit {
  id: number;
  title: string;
  poster_path: string | null;
  character: string;
  release_date: string;
}

export default function ActorProfileScreen() {
  const { id } = useLocalSearchParams();

  const [actor, setActor] = useState<ActorDetails | null>(null);
  const [movies, setMovies] = useState<MovieCredit[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchActorData = async () => {
      setIsLoading(true);
      try {
        // Promise.all executa as requisições em paralelo
        const [actorResponse, moviesResponse] = await Promise.all([
          api.get(`/person/${id}`),
          api.get(`/person/${id}/movie_credits`)
        ]);

        setActor(actorResponse.data);

        // Filtra filmes sem data de lançamento e ordena dos mais recentes para os mais antigos
        const sortedMovies = moviesResponse.data.cast
          .filter((movie: MovieCredit) => movie.release_date)
          .sort((a: MovieCredit, b: MovieCredit) =>
            new Date(b.release_date).getTime() - new Date(a.release_date).getTime()
          );

        setMovies(sortedMovies);
      } catch (error) {
        console.error('Erro ao buscar dados do ator:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchActorData();
  }, [id]);

  const renderMovieItem = ({ item }: { item: MovieCredit }) => (
    <Link href={`/movie/${item.id}`} asChild>
      <Pressable style={styles.movieCard}>
        <Image
          source={
            item.poster_path
              ? `https://image.tmdb.org/t/p/w200${item.poster_path}`
              : null // Fallback tratado pelo layout se for null
          }
          style={styles.moviePoster}
          contentFit="cover"
          transition={300}
        />
        <Text style={styles.movieTitle} numberOfLines={2}>{item.title}</Text>
        <Text style={styles.movieCharacter} numberOfLines={1}>{item.character}</Text>
      </Pressable>
    </Link>
  );

  if (isLoading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color="#E50914" />
      </View>
    );
  }

  if (!actor) {
    return (
      <View style={styles.center}>
        <Text style={styles.errorText}>Ator não encontrado.</Text>
      </View>
    );
  }

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <Image
          source={
            actor.profile_path
              ? `https://image.tmdb.org/t/p/w500${actor.profile_path}`
              : require('../../assets/images/partial-react-logo.png')
          }
          style={styles.profileImage}
          contentFit="cover"
        />
        <Text style={styles.name}>{actor.name}</Text>
        {actor.birthday && (
          <Text style={styles.subtitle}>
            Nascimento: {actor.birthday} {actor.place_of_birth ? `(${actor.place_of_birth})` : ''}
          </Text>
        )}
      </View>

      <View style={styles.content}>
        <Text style={styles.sectionTitle}>Biografia</Text>
        <Text style={styles.biography}>
          {actor.biography || 'Biografia não disponível em português.'}
        </Text>

        <Text style={[styles.sectionTitle, { marginTop: 24 }]}>Filmografia</Text>
      </View>

      <FlatList
        horizontal
        data={movies}
        keyExtractor={(item, index) => `${item.id}-${index}`} // O index evita bugs se a API retornar IDs duplicados no cast
        renderItem={renderMovieItem}
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.listContainer}
      />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#121212' },
  center: { flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#121212' },
  header: { alignItems: 'center', padding: 20, backgroundColor: '#1F1F1F' },
  profileImage: { width: 150, height: 150, borderRadius: 75, marginBottom: 16 },
  name: { color: '#FFFFFF', fontSize: 24, fontWeight: 'bold' },
  subtitle: { color: '#9CA3AF', fontSize: 14, marginTop: 4, textAlign: 'center' },
  content: { padding: 20 },
  sectionTitle: { color: '#FFFFFF', fontSize: 20, fontWeight: 'bold', marginBottom: 12 },
  biography: { color: '#D1D5DB', fontSize: 16, lineHeight: 24 },
  errorText: { color: '#FFFFFF', fontSize: 18 },
  listContainer: { paddingHorizontal: 20, paddingBottom: 40, gap: 16 },
  movieCard: { width: 120 },
  moviePoster: { width: 120, height: 180, borderRadius: 8, backgroundColor: '#333' },
  movieTitle: { color: '#FFFFFF', fontSize: 14, fontWeight: 'bold', marginTop: 8 },
  movieCharacter: { color: '#9CA3AF', fontSize: 12, marginTop: 4 },
});
