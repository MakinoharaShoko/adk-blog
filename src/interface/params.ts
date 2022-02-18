export interface PageParams {
    page: number,
    pagesize: number,
    authorId?: number,
    tagId?: number | string,
    year?: string,
    month?: string,
    orderRole?: string
}

/**
 * private Long authorId;
    private Long articleId;
    private Long toUid;
    private Long parentId;
    private String content;
 */
export interface CommentParams {
    articleId: string,
    toUid?: string,
    parentId?: string,
    content: string
}

export interface MessageParamsForADK {
    authorName: string,
    contact: string,
    content: string,
    avatar: string
}

export interface RegisterParams {
    username: string,
    nickname: string,
    password: string
}

export interface UpdateUserInfoParams {
    avatar: string,
    nickname: string,
    introduce: string,
    banner: string,
    gender: string,
    email: string
}