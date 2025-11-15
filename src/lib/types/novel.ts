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
	chapter_number: number;
	book_id: string;
	asset: string | null;
	created_at: string;
	updated_at: string;
}

export interface ChapterResponse {
	data: Chapter[];
}
