// Color palettes for CodeMap Coworking visualization
import { CharacterPalette } from './types';

// COWORKING CREATIVE PALETTE - Modern, energetic colors
export const PALETTE = {
  // Light modern wood floor (root/default)
  woodFloor: {
    base: '#D4C4A8',
    highlight: '#E8DCC8',
    shadowLight: '#C4B498',
    shadowDark: '#B4A488',
    gap: '#8A7A5A',
  },
  // Teal/aquamarine tiles (client) - creative energy
  greenTile: {
    base: '#2EC4B6',
    highlight: '#5DD9CD',
    shadowLight: '#26A89C',
    shadowDark: '#1E8C82',
    grout: '#167068',
  },
  // Cool gray tiles (server) - tech zone
  blueTile: {
    base: '#A8B8C8',
    highlight: '#C8D8E8',
    shadowLight: '#98A8B8',
    shadowDark: '#8898A8',
    grout: '#687888',
  },
  // Warm white tiles (src) - clean workspace
  creamTile: {
    base: '#F5F5F0',
    highlight: '#FFFFFF',
    shadowLight: '#E8E8E0',
    shadowDark: '#DCDCD4',
    grout: '#C4C4B8',
  },
  // Purple creative tiles (components/hooks/utils)
  lavenderTile: {
    base: '#9B5DE5',
    highlight: '#B87DF0',
    shadowLight: '#8A4DD4',
    shadowDark: '#7A3DC4',
    grout: '#5A2DA4',
  },
  // Orange energetic tiles (alternative)
  peachTile: {
    base: '#FF6B35',
    highlight: '#FF8B5A',
    shadowLight: '#E85A28',
    shadowDark: '#D0491B',
    grout: '#A03812',
  },
  // Wall colors (clean white/light gray)
  wall: {
    light: '#FAFAFA',
    mid: '#F0F0F0',
    dark: '#E4E4E4',
    baseboard: '#505050',
  },
  // Furniture (modern minimal)
  desk: {
    light: '#F0E8DC',
    white: '#FFFFFF',
    metal: '#D0D4D8',
  },
  // Accent colors (vibrant coworking)
  green: { base: '#4CAF50', light: '#6EC071', dark: '#3D8B40' },
  blue: { base: '#2196F3', light: '#4DB6FF', dark: '#1976D2' },
  amber: { base: '#FFD166', light: '#FFE088', highlight: '#FFF0AA' },
  orange: { base: '#FF6B35', light: '#FF8B5A', dark: '#E85A28' },
  teal: { base: '#2EC4B6', light: '#5DD9CD', dark: '#26A89C' },
  purple: { base: '#9B5DE5', light: '#B87DF0', dark: '#7A3DC4' },
  shadow: 'rgba(50, 50, 60, 0.15)',
  shadowMid: 'rgba(50, 50, 60, 0.25)',
  // OUTDOOR ENVIRONMENT - Rooftop terrace
  grass: {
    base: '#4CAF50',
    light: '#6EC071',
    dark: '#3D8B40',
    darkest: '#2E7D32',
  },
  // Wood decking for outdoor
  decking: {
    base: '#A08060',
    light: '#B89070',
    dark: '#907050',
    gap: '#604030',
  },
  water: {
    deep: '#3088B8',
    mid: '#48A8D0',
    light: '#68C8E8',
    highlight: '#90E0F8',
    foam: '#E8F8FF',
    foamInner: '#B8E8F8',
  },
  // Clean light colors
  warmWhite: '#FAFAFA',
  warmShadow: '#909090',
};

// Character color palettes - unique per character
export const CHARACTER_PALETTES: CharacterPalette[] = [
  { // Character 1 - Brown hair, Red shirt
    hair: { dark: '#483020', mid: '#604028', light: '#785038' },
    shirt: { dark: '#A81818', mid: '#C83030', light: '#E85050' },
    pants: { base: '#4858A8', shadow: '#303878' },
  },
  { // Character 2 - Blonde hair, Blue shirt
    hair: { dark: '#C8A028', mid: '#E8C848', light: '#F8E878' },
    shirt: { dark: '#1850A8', mid: '#3070C8', light: '#5090E8' },
    pants: { base: '#484848', shadow: '#303030' },
  },
  { // Character 3 - Black hair, Green shirt
    hair: { dark: '#282828', mid: '#404040', light: '#585858' },
    shirt: { dark: '#188818', mid: '#30A830', light: '#50C850' },
    pants: { base: '#4858A8', shadow: '#303878' },
  },
  { // Character 4 - Red hair, White shirt
    hair: { dark: '#902810', mid: '#B83820', light: '#D84830' },
    shirt: { dark: '#A8A8A8', mid: '#C8C8C8', light: '#E8E8E8' },
    pants: { base: '#484848', shadow: '#303030' },
  },
  { // Character 5 - Blue hair, Yellow shirt
    hair: { dark: '#385888', mid: '#5070A8', light: '#6888C8' },
    shirt: { dark: '#B88000', mid: '#D8A010', light: '#F8C030' },
    pants: { base: '#4858A8', shadow: '#303878' },
  },
];

// Shared character colors
export const SKIN = { base: '#F8D0A8', shadow: '#E0A878' };
export const OUTLINE = '#483828';
