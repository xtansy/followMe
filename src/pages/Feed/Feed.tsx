import "./styles.scss";

import { useCallback, useEffect, useState } from "react";
import { Input, List } from "antd";

import { ISubscription, type IPost } from "../../shared/types/entityTypes";
import { Post, CreatePostWidget } from "../../components";
import {
  createPost,
  getSubscriptions,
  type IPostParams,
  getLentaPosts,
} from "../../shared/api";
import { observer } from "mobx-react-lite";
import { useStore } from "../../store/context";
import { SUBSCRIPTIONS_MOCK } from "../../shared/constants";
import { like, unlike } from "../../shared/api";
import { CardDummy } from "../../shared/ui";
import { SearchOutlined } from "@ant-design/icons";

// const mockPosts: IPost[] = [
//   {
//     id: "1",
//     title: "Доступный пост",
//     availableBody: "это большой доступный всем пост...",
//     likesCount: 42,
//     liked: false,
//     files: [],
//     fullContent: true,
//     user: {
//       userId: "1",
//       username: "andrey_dev",
//       avatarFileId: IMAGE_URL_MOCK,
//     },
//     publishDate: "2025-05-20T17:34:56.767186909Z",
//     subscription: {
//       title: "string",
//       description: "string",
//       level: 1,
//       price: {
//         units: 0,
//         nanos: 0,
//       },
//     },
//   },
//   {
//     id: "2",
//     title: "Закрытый пост",
//     availableBody: "это маленький, недоступный никому закрытый пост",
//     likesCount: 89,
//     liked: false,
//     files: [],
//     user: {
//       userId: "2",
//       username: "hidden_author",
//       avatarFileId: IMAGE_URL_MOCK,
//     },
//     publishDate: "2025-05-20T17:34:56.767186909Z",
//     subscription: {
//       title: "string",
//       description: "string",
//       level: 1,
//       price: {
//         units: 0,
//         nanos: 0,
//       },
//     },
//   },
// ];

export const Feed = observer(() => {
  const { userStore } = useStore();
  const [posts, setPosts] = useState<IPost[]>([]);
  const [filteredPosts, setFilteredPosts] = useState<IPost[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [subscriptions, setSubscriptions] =
    useState<ISubscription[]>(SUBSCRIPTIONS_MOCK);
  const [searchTimeout, setSearchTimeout] = useState<any>(null);

  const onLike = (postId: string) => {
    setPosts((prevPosts) =>
      prevPosts.map((post) =>
        post.id === postId && post.fullContent
          ? {
              ...post,
              liked: !post.liked,
              likesCount: post.likesCount + (post.liked ? -1 : 1),
            }
          : post
      )
    );
    const post = posts.find((post) => post.id === postId);
    if (!post) return;

    if (post.liked) {
      unlike(postId);
    } else {
      like(postId);
    }
  };

  const handleCreatePost = (newPost: IPostParams) => {
    createPost(newPost);
  };

  const fetchSubscriptions = (id: string | null) => {
    if (id) {
      getSubscriptions(id).then((fetchedSubscriptions) => {
        setSubscriptions((old) => [...old, ...fetchedSubscriptions]);
      });
    }
  };

  const onCommentAdded = (postId: string, newComment: IPost["comments"][0]) => {
    setPosts((prevPosts) =>
      prevPosts.map((post) =>
        post.id === postId
          ? {
              ...post,
              comments: [...(post.comments || []), newComment],
            }
          : post
      )
    );
  };

  const onCommentDeleted = (postId: string, commentId: string) => {
    setPosts((prevPosts) =>
      prevPosts.map((post) =>
        post.id === postId
          ? {
              ...post,
              comments: post.comments.filter(
                (comment) => comment.id !== commentId
              ),
            }
          : post
      )
    );
  };

  useEffect(() => {
    fetchSubscriptions(userStore.userId);
  }, [userStore.userId]);

  useEffect(() => {
    getLentaPosts({ page: 1 }).then((fetchedPosts) => {
      setPosts(fetchedPosts);
    });
  }, [userStore.userId]);

  const filterPosts = useCallback((query: string, postsList: IPost[]) => {
    if (!query.trim()) {
      return postsList;
    }

    const lowerCaseQuery = query.toLowerCase();
    return postsList.filter(
      (post) =>
        post.title.toLowerCase().includes(lowerCaseQuery) ||
        post.availableBody.toLowerCase().includes(lowerCaseQuery)
    );
  }, []);

  const handleSearch = useCallback(
    (query: string) => {
      if (searchTimeout) {
        clearTimeout(searchTimeout);
      }

      const timeout = setTimeout(() => {
        setFilteredPosts(filterPosts(query, posts));
      }, 300);

      setSearchTimeout(timeout);
    },
    [filterPosts, posts, searchTimeout]
  );

  const onSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const query = e.target.value;
    setSearchQuery(query);
    handleSearch(query);
  };

  useEffect(() => {
    setFilteredPosts(filterPosts(searchQuery, posts));
  }, [posts, searchQuery, filterPosts]);

  return (
    <div className="feed-page">
      <div className="feed-container">
        {userStore.isAuthenticated && (
          <>
            <div className="search-container">
              <Input
                placeholder="Поиск по названию или описанию"
                prefix={<SearchOutlined />}
                value={searchQuery}
                onChange={onSearchChange}
                allowClear
              />
            </div>
            <CreatePostWidget
              onSubmit={handleCreatePost}
              subscriptions={subscriptions}
            />
          </>
        )}
        {userStore.isAuthenticated ? (
          <>
            {filteredPosts.length > 0 ? (
              <List
                dataSource={filteredPosts}
                itemLayout="vertical"
                renderItem={(post) => (
                  <List.Item key={post.id}>
                    <Post
                      onCommentAdded={onCommentAdded}
                      onCommentDeleted={onCommentDeleted}
                      post={post}
                      onLike={onLike}
                      isAuthenticated={userStore.isAuthenticated}
                    />
                  </List.Item>
                )}
              />
            ) : (
              <div style={{ marginTop: "30px" }}>
                <CardDummy
                  title={
                    searchQuery
                      ? "Ничего не найдено"
                      : "В Вашей ленте еще нет постов"
                  }
                  subtitle={
                    searchQuery
                      ? "Попробуйте изменить поисковый запрос"
                      : "Подпишитесь на интересных авторов, чтобы получить доступ к эксклюзивному контенту"
                  }
                />
              </div>
            )}
          </>
        ) : (
          <div style={{ marginTop: "30px" }}>
            <CardDummy
              title="Посты недоступны"
              subtitle="Зарегистрируйтесь или войдите, чтобы смотреть посты"
            />
          </div>
        )}
      </div>
    </div>
  );
});
