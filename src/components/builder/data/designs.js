export const colors = [
  { name: 'WHITE', hex: '#ffffff' },
  { name: 'BLACK', hex: '#000000' },
  { name: 'NIGHT', hex: '#1a1a1a' },
  { name: 'CHARCOAL', hex: '#333333' },
  { name: 'GRAPHITE', hex: '#4a4a4a' },
  { name: 'SLATE', hex: '#708090' },
  { name: 'SILVER', hex: '#c0c0c0' },
  { name: 'PLATINUM', hex: '#e5e4e2' },
  { name: 'NAVY', hex: '#000080' },
  { name: 'MIDNIGHT', hex: '#191970' },
  { name: 'ROYAL', hex: '#4169e1' },
  { name: 'COBALT', hex: '#0047ab' },
  { name: 'SKY', hex: '#87ceeb' },
  { name: 'CYAN', hex: '#00ffff' },
  { name: 'TEAL', hex: '#008080' },
  { name: 'FOREST', hex: '#228b22' },
  { name: 'EMERALD', hex: '#50c878' },
  { name: 'MINT', hex: '#98ff98' },
  { name: 'LIME', hex: '#32cd32' },
  { name: 'NEON', hex: '#ccff00' },
  { name: 'YELLOW', hex: '#ffff00' },
  { name: 'GOLD', hex: '#ffd700' },
  { name: 'AMBER', hex: '#ffbf00' },
  { name: 'ORANGE', hex: '#ff8c00' },
  { name: 'CORAL', hex: '#ff7f50' },
  { name: 'RED', hex: '#ff0000' },
  { name: 'CRIMSON', hex: '#dc143c' },
  { name: 'MAROON', hex: '#800000' },
  { name: 'BURGUNDY', hex: '#800020' },
  { name: 'MAGENTA', hex: '#ff00ff' },
  { name: 'PURPLE', hex: '#800080' },
  { name: 'VIOLET', hex: '#ee82ee' },
  { name: 'LAVENDER', hex: '#e6e6fa' },
  { name: 'PINK', hex: '#ffc0cb' },
  { name: 'HOT PINK', hex: '#ff69b4' },
];

export const designs = [
  {
    id: 'D1',
    name: 'CLOSER / J-0002',
    modelUrl: '/shirt.glb',
    mapping: {
      'Body': 'primary',
      'Front': 'primary',
      'Back': 'primary',
      'R_Sleeve': 'secondary',
      'L_Sleeve': 'secondary',
      'Neck': 'third',
      'Mesh': 'third'
    }
  },
  {
    id: 'D2',
    name: 'STEAL / J-0005',
    modelUrl: '/shirt.glb',
    mapping: {
      'Body': 'secondary',
      'Front': 'secondary',
      'Back': 'secondary',
      'R_Sleeve': 'primary',
      'L_Sleeve': 'primary',
      'Neck': 'third',
      'Mesh': 'third'
    }
  },
  {
    id: 'D3',
    name: 'THROWBACK / J-0006',
    modelUrl: '/shirt.glb',
    mapping: {
      'Body': 'primary',
      'Front': 'primary',
      'Back': 'primary',
      'R_Sleeve': 'primary',
      'L_Sleeve': 'primary',
      'Neck': 'secondary',
      'Mesh': 'third'
    }
  },
  {
    id: 'D4',
    name: 'CURVE / J-0009',
    modelUrl: '/shirt.glb',
    mapping: {
      'Body': 'third',
      'Front': 'third',
      'Back': 'third',
      'R_Sleeve': 'primary',
      'L_Sleeve': 'primary',
      'Neck': 'secondary',
      'Mesh': 'secondary'
    }
  },
  {
    id: 'D5',
    name: 'ALL-STAR / J-0010',
    modelUrl: '/shirt.glb',
    mapping: {
      'Body': 'primary',
      'Front': 'primary',
      'Back': 'primary',
      'R_Sleeve': 'third',
      'L_Sleeve': 'third',
      'Neck': 'secondary',
      'Mesh': 'secondary'
    }
  },
  {
    id: 'D6',
    name: 'TACKLE / J-0030',
    modelUrl: '/shirt.glb',
    mapping: {
      'Body': 'secondary',
      'Front': 'secondary',
      'Back': 'secondary',
      'R_Sleeve': 'secondary',
      'L_Sleeve': 'secondary',
      'Neck': 'primary',
      'Mesh': 'third'
    }
  },
  {
    id: 'D7',
    name: 'BRONCO / J-0051',
    modelUrl: '/shirt.glb',
    mapping: {
      'Body': 'primary',
      'Front': 'primary',
      'Back': 'primary',
      'R_Sleeve': 'secondary',
      'L_Sleeve': 'secondary',
      'Neck': 'secondary',
      'Mesh': 'third'
    }
  },
  {
    id: 'D8',
    name: 'SIDELINE / J-0052',
    modelUrl: '/shirt.glb',
    mapping: {
      'Body': 'third',
      'Front': 'third',
      'Back': 'third',
      'R_Sleeve': 'third',
      'L_Sleeve': 'third',
      'Neck': 'primary',
      'Mesh': 'secondary'
    }
  }
];
