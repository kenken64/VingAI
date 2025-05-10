export interface Model {
    id: string;
    name: string;
    path: string;
    size: number;
    dateDownloaded: Date;
}

export interface SerializableModel {
    id: string;
    name: string;
    path: string;
    size: number;
    dateDownloaded: string; // Date as string instead of Date object
}