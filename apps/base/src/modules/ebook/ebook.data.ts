export enum EbookType {
  PDF = 'PDF',
  EPUB = 'EPUB',
}

export enum ECurrency {
  USD = 'USD',
  PHP = 'PHP',
}

export type IEbookAuthor = {
  name: string;
};

export type IEbook = {
  ebookNumber: string;
  ebookId: string;
  title: string;
  ebookType: EbookType;
  price: number;
  currency: ECurrency;
  author?: IEbookAuthor;
  access?: { url: string }; // jika ada ini, artinya sudah dibeli
  description: string;
  size: string;
  pages: number;
  downloaded?: number;
  publisher?: string;
  accessOffline?: { encryptedFilePath: string; iv: string; tag: string };
  publisedOn: string;
  genres: string[];
};

export const EBOOKS = [
  {
    ebookNumber: '678HKAO0A',
    author: { name: 'Adrian Shaugnessy' },
    ebookId: '84114051-63a8-4513-a446-04f717e71ad1',
    title: 'Sample EPUB Accessible',
    price: 9.9,
    currency: ECurrency.USD,
    ebookType: EbookType.EPUB,
    access: {
      url: 'https://qbit-tech.sgp1.digitaloceanspaces.com/dev-ebooks/accessible_epub_3.epub',
    },
    size: '4.5mb',
    publisher: 'Pottermire Publishing',
    pages: 1200,
    publisedOn: '22 March 2023',
    genres: ['Action', 'Romance'],
    downloaded: 22000,
    description:
      'Lorem ipsum dolor sit amet consectetur. In iaculis massa etiam proin ullamcorper. Sed neque nullam morbi pellentesque eget mi viverra. At tristique vel turpis eget volutpat lacus sagittis lacinia magna.',
  },
  {
    ebookNumber: '678HKAO0A',
    author: { name: 'Adrian Shaugnessy' },
    ebookId: '33c27808-c867-45f7-b50c-60fa78815999',
    title: 'Sample PDF Without Password',
    ebookType: EbookType.PDF,
    price: 5,
    downloaded: 22000,
    currency: ECurrency.USD,
    access: {
      url: 'https://qbit-tech.sgp1.digitaloceanspaces.com/dev-ebooks/sample-pdf-2.pdf',
    },
    size: '4.5mb',
    publisher: 'Pottermire Publishing',
    pages: 1200,
    publisedOn: '22 March 2023',
    genres: ['Action', 'Romance'],
    description:
      'Lorem ipsum dolor sit amet consectetur. In iaculis massa etiam proin ullamcorper. Sed neque nullam morbi pellentesque eget mi viverra. At tristique vel turpis eget volutpat lacus sagittis lacinia magna.',
  },
  {
    ebookNumber: '678HKAO0A',
    author: { name: 'Adrian Shaugnessy' },
    ebookId: '619a7bd8-ae19-4e5c-a8b0-0c0f00d4e7db',
    title: 'Sample EPUB Cardio',
    ebookType: EbookType.EPUB,
    price: 7.5,
    currency: ECurrency.USD,
    access: {
      url: 'https://qbit-tech.sgp1.digitaloceanspaces.com/dev-ebooks/sample-epub-cardio.epub',
    },
    size: '4.5mb',
    publisher: 'Pottermire Publishing',
    pages: 1200,
    publisedOn: '22 March 2023',
    genres: ['Action', 'Romance'],
    downloaded: 22000,
    description:
      'Lorem ipsum dolor sit amet consectetur. In iaculis massa etiam proin ullamcorper. Sed neque nullam morbi pellentesque eget mi viverra. At tristique vel turpis eget volutpat lacus sagittis lacinia magna.',
  },
  {
    ebookNumber: '678HKAO0A',
    author: { name: 'Adrian Shaugnessy' },
    ebookId: '11c27808-c867-45f7-b50c-60fa78815984',
    title: 'Sample PDF Cardio - With Password',
    ebookType: EbookType.PDF,
    price: 3,
    currency: ECurrency.USD,
    access: {
      url: 'https://qbit-tech.sgp1.digitaloceanspaces.com/dev-ebooks/sample-pdf-cardio.pdf',
    },
    size: '4.5mb',
    publisher: 'Pottermire Publishing',
    pages: 1200,
    publisedOn: '22 March 2023',
    genres: ['Action', 'Romance'],
    downloaded: 22000,
    description:
      'Lorem ipsum dolor sit amet consectetur. In iaculis massa etiam proin ullamcorper. Sed neque nullam morbi pellentesque eget mi viverra. At tristique vel turpis eget volutpat lacus sagittis lacinia magna.',
  },
];
