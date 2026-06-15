export interface Collection {
  id: string;
  title: string;
  pageCount: number;
  image: string;
}

export interface ColoringPage {
  id: string;
  title: string;
  lineArt: string;
  colored: string;
  category: string;
}

export interface DownloadItem {
  id: string;
  title: string;
  description: string;
  icon: string;
}

export const collections: Collection[] = [
  {
    id: "jesus",
    title: "Jesus",
    pageCount: 56,
    image: "/images/collections/jesus.jpg",
  },
  {
    id: "noahs-ark",
    title: "Noah's Ark",
    pageCount: 48,
    image: "/images/collections/noahs-ark.jpg",
  },
  {
    id: "miracles",
    title: "Miracles",
    pageCount: 42,
    image: "/images/collections/miracles.jpg",
  },
];

export const coloringPages: ColoringPage[] = [
  {
    id: "1",
    title: "Jesus Blesses the Children",
    lineArt: "/images/coloring/jesus-children-line.jpg",
    colored: "/images/coloring/jesus-children-color.jpg",
    category: "Jesus",
  },
  {
    id: "2",
    title: "The Good Shepherd",
    lineArt: "/images/coloring/good-shepherd-line.jpg",
    colored: "/images/coloring/good-shepherd-color.jpg",
    category: "Jesus",
  },
  {
    id: "3",
    title: "Walking on Water",
    lineArt: "/images/coloring/walking-water-line.jpg",
    colored: "/images/coloring/walking-water-color.jpg",
    category: "Miracles",
  },
  {
    id: "4",
    title: "Nativity Scene",
    lineArt: "/images/coloring/nativity-line.jpg",
    colored: "/images/coloring/nativity-color.jpg",
    category: "Christmas",
  },
  {
    id: "5",
    title: "Daniel in the Lions' Den",
    lineArt: "/images/coloring/daniel-line.jpg",
    colored: "/images/coloring/daniel-color.jpg",
    category: "Old Testament",
  },
  {
    id: "6",
    title: "The Last Supper",
    lineArt: "/images/coloring/last-supper-line.jpg",
    colored: "/images/coloring/last-supper-color.jpg",
    category: "Jesus",
  },
];

export const downloadItems: DownloadItem[] = [
  {
    id: "pdf",
    title: "PDF Coloring Pages",
    description: "Printable and ready to color",
    icon: "file-text",
  },
  {
    id: "wallpapers",
    title: "4K Wallpapers",
    description: "Beautiful wallpapers for your devices",
    icon: "image",
  },
  {
    id: "activities",
    title: "Printable Activities",
    description: "Fun activities for all ages",
    icon: "puzzle",
  },
];

export const bibleVerse = {
  text: "The Lord is my shepherd; I shall not want.",
  reference: "Psalm 23:1",
};

export const navLinks = [
  { label: "Videos", href: "#videos" },
  { label: "Coloring Pages", href: "#coloring-pages" },
  { label: "Wallpapers", href: "#wallpapers" },
  { label: "Bible Stories", href: "#bible-stories" },
  { label: "About", href: "#about" },
];
