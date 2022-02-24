import { GetStaticProps } from 'next';
import Image from 'next/image';
import Prismic from '@prismicio/client';
import { ReactElement } from 'react';

import { getPrismicClient } from '../services/prismic';

import commonStyles from '../styles/common.module.scss';
import styles from './home.module.scss';

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
  return (
    <>
      <Image
        src="/spacetraveling-logo.svg"
        alt="logo"
        width="240"
        height="25"
      />
      {postsPagination.results.map(post => {
        return (
          <div>
            <h1>{post.data.title}</h1>
          </div>
        );
      })}
    </>
  );
}

export const getStaticProps: GetStaticProps = async () => {
  const prismic = getPrismicClient();
  const postsResponse = await prismic.query(
    Prismic.predicates.at('document.type', 'posts')
  );

  const posts = postsResponse.results.map(post => {
    return {
      uid: post.uid,
      first_publication_date: post.last_publication_date,
      data: {
        title: post.data.title,
        substitle: post.data.subtitle,
        author: post.data.author,
      },
    };
  });

  console.log(posts);

  return {
    props: {
      postsPagination: {
        results: posts,
        next_page: '',
      },
    },
  };
};
