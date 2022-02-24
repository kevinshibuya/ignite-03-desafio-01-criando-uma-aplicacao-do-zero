import { GetStaticProps } from 'next';
import Link from 'next/link';
import Prismic from '@prismicio/client';
import { ReactElement, useState } from 'react';
import { format } from 'date-fns';
import ptBR from 'date-fns/locale/pt-BR';
import * as FiIcons from 'react-icons/fi';
import ApiSearchResponse from '@prismicio/client/types/ApiSearchResponse';

import { getPrismicClient } from '../services/prismic';

import commonStyles from '../styles/common.module.scss';
import styles from './home.module.scss';
import Header from '../components/Header';

interface Post {
  uid?: string;
  first_publication_date: string | null;
  data: {
    title: string;
    subtitle: string;
    author: string;
  };
}

interface PostPagination {
  next_page: string;
  results: Post[];
}

interface HomeProps {
  postsPagination: PostPagination;
}

export default function Home({ postsPagination }: HomeProps): ReactElement {
  const [postsData, setPostsData] = useState(postsPagination);
  // eslint-disable-next-line @typescript-eslint/explicit-function-return-type
  async function loadMorePosts(next_page: string) {
    const nextPageData: ApiSearchResponse = await fetch(next_page).then(res =>
      res.json()
    );

    const nextPosts = nextPageData.results.map(post => {
      return {
        uid: post.uid,
        first_publication_date: format(
          new Date(post.last_publication_date),
          'd MMM yyyy',
          {
            locale: ptBR,
          }
        ),
        data: {
          title: post.data.title,
          subtitle: post.data.subtitle,
          author: post.data.author,
        },
      };
    });

    const posts = {
      next_page: nextPageData.next_page,
      results: [...postsData.results, ...nextPosts],
    };

    setPostsData(posts);
  }
  return (
    <div className={`${commonStyles.container} ${styles.homeContainer}`}>
      <Header />
      {postsData.results.map(post => {
        return (
          <Link key={post.uid} href={`/post/${post.uid}`}>
            <a className={styles.homePost}>
              <h1>{post.data.title}</h1>
              <p>{post.data.subtitle}</p>
              <div className={styles.postDetails}>
                <div className={styles.details}>
                  <FiIcons.FiCalendar />
                  {post.first_publication_date}
                </div>
                <div className={styles.details}>
                  <FiIcons.FiUser />
                  {post.data.author}
                </div>
              </div>
            </a>
          </Link>
        );
      })}
      {postsData.next_page ? (
        <button
          onClick={() => loadMorePosts(postsData.next_page)}
          type="button"
        >
          Carregar mais posts
        </button>
      ) : (
        ''
      )}
    </div>
  );
}

export const getStaticProps: GetStaticProps = async () => {
  const prismic = getPrismicClient();
  const postsResponse = await prismic.query(
    [Prismic.predicates.at('document.type', 'posts')],
    {
      pageSize: 1,
    }
  );

  const posts = postsResponse.results.map(post => {
    return {
      uid: post.uid,
      first_publication_date: format(
        new Date(post.last_publication_date),
        'd MMM yyyy',
        {
          locale: ptBR,
        }
      ),
      data: {
        title: post.data.title,
        subtitle: post.data.subtitle,
        author: post.data.author,
      },
    };
  });

  return {
    props: {
      postsPagination: {
        results: posts,
        next_page: postsResponse.next_page,
      },
    },
  };
};
