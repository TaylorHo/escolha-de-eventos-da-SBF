export interface Session {
  session: string;
  date: string;
  time: string;
  location: string;
  presentations: Presentation[];
}

export interface Presentation {
  title: string;
  abstract: string;
  field: string;
  presentedBy: string;
  authors: Author[];
  hour: string;
  id: string;
}

export interface Author {
  author: string;
  universities: string[];
}
