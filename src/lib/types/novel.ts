export interface Novel {
	id: string;
	title: string;
	author: string;
	cover: string;
	description: string;
	asset: string | null;
	status: string;
	language: string;
	release_date: number;
	popular: boolean;
	created_at: string;
	updated_at: string;
}

export interface NovelResponse {
	data: Novel[];
	page: number;
	page_size: number;
	total_items: number;
	total_pages: number;
}

export interface Chapter {
	id: string;
	title: string;
	chapter_num: number;
	book_id: string;
	description: string;
	content: string;
	created_at: string;
	updated_at: string;
}

export interface ChapterResponse {
	data: Chapter[];
}

export interface SingleChapterResponse {
	data: Chapter;
}

export interface Genre {
	id: string;
	title: string;
	description: string;
	created_at: string;
	updated_at: string;
}

export interface GenreResponse {
	data: Genre[];
}

export interface SingleGenreResponse {
	data: Genre;
}

