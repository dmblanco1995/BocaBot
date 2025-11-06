export interface Tweet {
  id: string;
  text: string;
}

export type Tone = 'Profesional' | 'Casual' | 'Divertido' | 'Inspirador' | 'Informativo';

export const tones: Tone[] = ['Profesional', 'Casual', 'Divertido', 'Inspirador', 'Informativo'];
