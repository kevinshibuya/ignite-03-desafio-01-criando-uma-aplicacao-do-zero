import Image from 'next/image';
import Link from 'next/link';
import { ReactElement } from 'react';

import styles from './header.module.scss';

export default function Header(): ReactElement {
  return (
    <Link href="/">
      <a className={styles.image}>
        <Image
          src="/spacetraveling-logo.svg"
          alt="logo"
          width="240"
          height="25"
        />
      </a>
    </Link>
  );
}
