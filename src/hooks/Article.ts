import { encodeEmoji, decodeEmoji } from './../utils/emoji';
import { getArticleItem } from "@/api/article";
import { addComment, getComments } from "@/api/comment";
import { useUserStore } from "@/store/user";
import { getRealativeTime } from "@/utils/dayjs";
import { ElMessage } from "element-plus";
import { useRoute } from "vue-router";
import _ from "lodash";
import { userCollect, userLike } from "@/api/user";
import { storeToRefs } from 'pinia';

export const useArticle = () => {
    const route = useRoute();
    const userStore = useUserStore();
    let user=storeToRefs(userStore).userinfo;
    let emoji=ref();
    // 定义所有使用到的变量
    let comment = ref("");
    let commentParams: CommentParams = reactive({
        articleId: route.params.id as string,
        authorId: user.value.id,
        content: comment,
    });
    let article = ref<ArticleItemInfo>();
    let commentList = ref<CommentItemInfo[]>([]);
    // loading
    let isLikedLoading = ref(false);
    let isCollectLoading = ref(false);
    // 评论分页参数
    let pageparams: PageParams = reactive({
        page: 1,
        pagesize: 10,
    });
    let totalComment=ref(0);
    // 计算属性 计算相对时间
    let time = computed(() => {
        article.value as ArticleItemInfo;
        if (article.value) {
            return getRealativeTime(article.value.createDate);
        }
    });

    // 方法区-----------------------
    // 发送一级评论
    const publishComment = async () => {
        if (commentParams.content != "") {
            commentParams.content = encodeEmoji(commentParams.content);
            const { data } = await addComment(commentParams);
            if (data.code === 200) {
                ElMessage.success("发布成功");
                emoji.value.clearInput();
                getAllComment();
            } else {
                ElMessage.error(data.msg);
            }
        } else {
            ElMessage.error("内容不能为空");
        }
    };
    // 获取文章
    const getArticle = async (id: any) => {
        const { data } = await getArticleItem(id);
        if (data.code === 200) {
            article.value = data.data;
        } else {
            ElMessage.error(data.msg);
        }
    };
    const changeComment=(content: string)=>{
        comment.value = content;
    }
    // 获取评论
    const getAllComment = async () => {
        const { data } = await getComments(route.params.id as string, pageparams);
        commentList.value = data.data.results;
        totalComment.value=data.data.length;
        commentList.value.map(item => {
            item.content = decodeEmoji(item.content);
            if(item.childrens){
                item.childrens.forEach(child=>{
                    child.content=decodeEmoji(child.content);
                })
            }
            return item
        })
    };
    // 滚动
    const body = ref<HTMLElement | null>();
    const goTop = () => {
        console.log(body.value?.scrollTop);
    };
    // 接受发送二级评论
    const publishSecond = () => {
        ElMessage.success("发送成功");
        getAllComment();
    };
    // 喜欢文章
    const likedArticle = async () => {
        isLikedLoading.value = true;
        // 如果是登录状态下
        if (user.value.id) {
            let likedValue = !article.value?.isLiked;
            if (article.value) {
                let reqParams: LikeOrCollectParams = {
                    articleId: article.value.id,
                    flag: likedValue,
                };
                await userLike(reqParams);
                article.value.isLiked = likedValue;
            }
        } else {
            ElMessage.error("请先登录后点赞");
        }
        isLikedLoading.value = false;
    };
    // 收藏文章
    const collectArticle = async () => {
        isCollectLoading.value = true;
        if (user.value.id) {
            let collectValue = !article.value?.isCollected;
            if (article.value) {
                let reqParams: LikeOrCollectParams = {
                    articleId: article.value.id,
                    flag: collectValue,
                };
                await userCollect(reqParams);
                article.value.isCollected = collectValue;
            }
        } else {
            ElMessage.error("请先登录后收藏");
        }
        isCollectLoading.value = false;
    };
    // 分页获取评论
    const changePage=()=>{
        getAllComment();
    }
    // 函数加载 挂载组件
    onMounted(() => {
        getArticle(route.params.id);
        getAllComment();
    });
    return {
        collectArticle,
        likedArticle,
        isLikedLoading,
        isCollectLoading,
        publishSecond,
        goTop,
        totalComment,
        getAllComment,
        changePage,
        publishComment,
        commentParams,
        time,
        article,
        commentList,
        pageparams,
        user,
        comment,
        changeComment,
        emoji
    }
}
/**
 * 要求一个ref
 * @returns 
 */
export const useEmoji = () => {
    let showEmoji = ref(false);
    let emojiTarget = ref(null);
    let disabledGroup = ["travel_places",
        "objects",
        "symbols",
        "flags"]
    let groupName = {
        "smileys_people": "经典黄豆",
        "animals_nature": "动物 自然",
        "food_drink": "食物饮料",
        "activities": "活动~",
    }
    let cursorIndex = ref(0);
    const handleInputBlur = (e: any) => {
        // 记录离开焦点时的光标位置
        cursorIndex.value = e.srcElement.selectionStart;
    }
    return {
        showEmoji,
        disabledGroup,
        groupName,
        handleInputBlur,
        emojiTarget,
        cursorIndex
    }
}