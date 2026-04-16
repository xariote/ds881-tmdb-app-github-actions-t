import { render, screen } from '@testing-library/react-native';
import { MovieCard } from '../MovieCard';

describe('Componente: MovieCard', () => {
  it('deve renderizar o título e o ano do filme corretamente', () => {
    const movieData = {
      title: 'Interstellar',
      year: '2014'
    };

    // Renderiza o componente em um ambiente de teste
    render(<MovieCard title={movieData.title} year={movieData.year} />);

    // Verifica se os elementos de texto estão presentes na tela
    const titleElement = screen.getByText('Interstellar');
    const yearElement = screen.getByText('2014');

    expect(titleElement).toBeTruthy();
    expect(yearElement).toBeTruthy();
  });
});
