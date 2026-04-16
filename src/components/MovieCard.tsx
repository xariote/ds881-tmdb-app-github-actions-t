import { View, Text, StyleSheet } from 'react-native';

interface MovieCardProps {
  title: string;
  year: string;
}

export function MovieCard({ title, year }: MovieCardProps) {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>{title}</Text>
      <Text style={styles.year}>{year}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { padding: 10, backgroundColor: '#f0f0f0' },
  title: { fontSize: 18, fontWeight: 'bold' },
  year: { fontSize: 14, color: '#666' }
});
