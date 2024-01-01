export enum EbookType {
  PDF = 'PDF',
  EPUB = 'EPUB',
  FLIPHTML5 = 'FLIPHTML5',
}

export enum ECurrency {
  USD = 'USD',
  PHP = 'PHP',
}

export type IEbookAuthor = {
  name: string;
};

type VideoOnPage = {
  page: number;
  watch_url: string;
  video_id: string;
};

export type IEbook = {
  ebookNumber: string;
  ebookId: string;
  coverUrl: string;
  title: string;
  ebookType: EbookType;
  price: number;
  currency: ECurrency;
  author?: IEbookAuthor;
  access?: { url: string; password?: string }; // jika ada ini, artinya sudah dibeli
  description: string;
  size: string;
  pages: number;
  downloaded?: number;
  publisher?: string;
  accessOffline?: { encryptedFilePath: string; iv: string; tag: string };
  publisedOn: string;
  genres: string[];
  videoOnPages?: VideoOnPage[];
};

export const EBOOKS: IEbook[] = [
  // {
  //   ebookNumber: '678HKAO0A',
  //   author: { name: 'Adrian Shaugnessy' },
  //   ebookId: '84114051-63a8-4513-a446-04f717e71ad1',
  //   coverUrl:
  //     'https://qbit-tech.sgp1.digitaloceanspaces.com/dev-ebooks/cover/84114051-63a8-4513-a446-04f717e71ad1.png',
  //   title: 'EBOOK 1 - Sample EPUB Accessible',
  //   price: 9.9,
  //   currency: ECurrency.USD,
  //   ebookType: EbookType.EPUB,
  //   access: {
  //     url: 'https://qbit-tech.sgp1.digitaloceanspaces.com/dev-ebooks/accessible_epub_3.epub',
  //   },
  //   size: '4.5mb',
  //   publisher: 'Pottermire Publishing',
  //   pages: 1200,
  //   publisedOn: '22 March 2023',
  //   genres: ['Action', 'Romance'],
  //   downloaded: 22000,
  //   description:
  //     'Lorem ipsum dolor sit amet consectetur. In iaculis massa etiam proin ullamcorper. Sed neque nullam morbi pellentesque eget mi viverra. At tristique vel turpis eget volutpat lacus sagittis lacinia magna.',
  // },
  {
    ebookNumber: '678HKAO0A',
    author: { name: 'Adrian Shaugnessy' },
    ebookId: '33c27808-c867-45f7-b50c-60fa78815999',
    coverUrl:
      'https://qbit-tech.sgp1.digitaloceanspaces.com/dev-ebooks/cover/33c27808-c867-45f7-b50c-60fa78815999.png',
    title: 'EBOOK 1 - Sample PDF Without Password',
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
    videoOnPages: [
      {
        page: 2,
        watch_url: 'https://www.youtube.com/watch?v=nYyvo_2xXK0',
        video_id: 'nYyvo_2xXK0',
      },
      {
        page: 5,
        watch_url: 'https://www.youtube.com/watch?v=nYyvo_2xXK0',
        video_id: 'nYyvo_2xXK0',
      },
    ],
  },
  // {
  //   ebookNumber: '678HKAO0A',
  //   author: { name: 'Adrian Shaugnessy' },
  //   ebookId: '619a7bd8-ae19-4e5c-a8b0-0c0f00d4e7db',
  //   coverUrl:
  //     'https://qbit-tech.sgp1.digitaloceanspaces.com/dev-ebooks/cover/619a7bd8-ae19-4e5c-a8b0-0c0f00d4e7db.png',
  //   title: 'EBOOK 3 - Sample EPUB Cardio',
  //   ebookType: EbookType.EPUB,
  //   price: 7.5,
  //   currency: ECurrency.USD,
  //   access: {
  //     url: 'https://qbit-tech.sgp1.digitaloceanspaces.com/dev-ebooks/619a7bd8-ae19-4e5c-a8b0-0c0f00d4e7db.epub',
  //   },
  //   size: '4.5mb',
  //   publisher: 'Pottermire Publishing',
  //   pages: 1200,
  //   publisedOn: '22 March 2023',
  //   genres: ['Action', 'Romance'],
  //   downloaded: 22000,
  //   description:
  //     'Lorem ipsum dolor sit amet consectetur. In iaculis massa etiam proin ullamcorper. Sed neque nullam morbi pellentesque eget mi viverra. At tristique vel turpis eget volutpat lacus sagittis lacinia magna.',
  // },
  {
    ebookNumber: '678HKAO0B',
    author: { name: 'Adrian Shaugnessy' },
    ebookId: '11c27808-c867-45f7-b50c-60fa78815984',
    coverUrl:
      'https://qbit-tech.sgp1.digitaloceanspaces.com/dev-ebooks/cover/11c27808-c867-45f7-b50c-60fa78815984.png',
    title: 'EBOOK 2 - Sample PDF Cardio - With Password',
    ebookType: EbookType.PDF,
    price: 3,
    currency: ECurrency.USD,
    access: {
      url: 'https://qbit-tech.sgp1.digitaloceanspaces.com/dev-ebooks/sample-pdf-cardio.pdf',
      password: 'implat123',
    },
    size: '4.5mb',
    publisher: 'Pottermire Publishing',
    pages: 1200,
    publisedOn: '22 March 2023',
    genres: ['Action', 'Romance'],
    downloaded: 22000,
    description:
      'Lorem ipsum dolor sit amet consectetur. In iaculis massa etiam proin ullamcorper. Sed neque nullam morbi pellentesque eget mi viverra. At tristique vel turpis eget volutpat lacus sagittis lacinia magna.',
    videoOnPages: [
      {
        page: 1,
        watch_url: 'https://www.youtube.com/watch?v=nYyvo_2xXK0',
        video_id: 'nYyvo_2xXK0',
      },
    ],
  },
  {
    ebookNumber: '678HKAO0C',
    author: { name: 'Adrian Shaugnessy' },
    ebookId: '52457cc6-f1aa-473c-bb31-7e0f00d73a3c',
    coverUrl:
      'https://qbit-tech.sgp1.digitaloceanspaces.com/dev-ebooks/cover/52457cc6-f1aa-473c-bb31-7e0f00d73a3c.png',
    title: 'EBOOK 3 - Sample PDF from SmallPDF',
    ebookType: EbookType.PDF,
    price: 3,
    currency: ECurrency.USD,
    access: {
      url: 'https://qbit-tech.sgp1.digitaloceanspaces.com/dev-ebooks/52457cc6-f1aa-473c-bb31-7e0f00d73a3c.pdf',
      password: 'implat123',
    },
    size: '1.2mb',
    publisher: 'Pottermire Publishing',
    pages: 120,
    publisedOn: '22 March 2023',
    genres: ['Action', 'Romance'],
    downloaded: 11000,
    description:
      'Lorem ipsum dolor sit amet consectetur. In iaculis massa etiam proin ullamcorper. Sed neque nullam morbi pellentesque eget mi viverra. At tristique vel turpis eget volutpat lacus sagittis lacinia magna.',
  },
  // {
  //   ebookNumber: '678HKAO0A',
  //   author: { name: 'Adrian Shaugnessy' },
  //   ebookId: '20a11b40-904d-4285-b4a7-17702daa1d79',
  //   coverUrl:
  //     'https://qbit-tech.sgp1.digitaloceanspaces.com/dev-ebooks/cover/20a11b40-904d-4285-b4a7-17702daa1d79.png',
  //   title: 'EBOOK 5 - Cardio FLIPHTM5',
  //   ebookType: EbookType.FLIPHTML5,
  //   price: 5,
  //   downloaded: 22000,
  //   currency: ECurrency.USD,
  //   access: {
  //     url: 'https://online.fliphtml5.com/pvmal/aslc/',
  //   },
  //   size: '4.5mb',
  //   publisher: 'Pottermire Publishing',
  //   pages: 1200,
  //   publisedOn: '22 March 2023',
  //   genres: ['Action', 'Romance'],
  //   description:
  //     'Lorem ipsum dolor sit amet consectetur. In iaculis massa etiam proin ullamcorper. Sed neque nullam morbi pellentesque eget mi viverra. At tristique vel turpis eget volutpat lacus sagittis lacinia magna.',
  // },
  // {
  //   ebookNumber: '678HKAO0A',
  //   author: { name: 'Adrian Shaugnessy' },
  //   ebookId: '3a9a65cb-cb2f-40a9-9be6-5ad21d9b059a',
  //   coverUrl:
  //     'https://qbit-tech.sgp1.digitaloceanspaces.com/dev-ebooks/cover/3a9a65cb-cb2f-40a9-9be6-5ad21d9b059a.png',
  //   title: 'EBOOK 6 - Sudah Ada Annotation Dari Ebook',
  //   ebookType: EbookType.FLIPHTML5,
  //   price: 5,
  //   downloaded: 22000,
  //   currency: ECurrency.USD,
  //   access: {
  //     url: 'https://online.fliphtml5.com/fyeuk/rnrv',
  //   },
  //   size: '4.5mb',
  //   publisher: 'Pottermire Publishing',
  //   pages: 1200,
  //   publisedOn: '22 March 2023',
  //   genres: ['Action', 'Romance'],
  //   description:
  //     'Lorem ipsum dolor sit amet consectetur. In iaculis massa etiam proin ullamcorper. Sed neque nullam morbi pellentesque eget mi viverra. At tristique vel turpis eget volutpat lacus sagittis lacinia magna.',
  // },
];
