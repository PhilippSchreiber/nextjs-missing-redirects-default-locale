import {slugPages, slugsForSSG} from "../data";
import {useRouter} from "next/router";
import Link from 'next/link'

const SlugPage = props => {
  const router = useRouter();

  if (router.isFallback) {
    return <h1>router.isFallback (Loading)</h1>;
  }

  const linkTargetLocale = router.locale === 'en' ? 'de' : 'en';
  const href = props.data.slug === 'index' ? '/' : props.data.slug;
  return <div className={'container'}>
    <h1>{props.data.title}</h1>
    <p>{props.data.content}</p>
    <Link href={href} locale={linkTargetLocale}><a>Content in other Language</a></Link>
  </div>
}

export const getStaticPaths = async () => {
  let paths = [];

  if (process.env.NODE_ENV === 'development') {
    return {
      paths,
      fallback: true,
    };
  }

  ['de', 'en'].forEach((locale) => {

    paths.push({
      params: {
        slug: null,
      },
      locale,
    });

    slugsForSSG.forEach((slug) => {
      paths.push({
        params: {
          slug: [slug],
        },
        locale,
      });
    })
  });

  return {
    paths,
    fallback: true,
  }
}

export const getStaticProps = async ({locale, params, preview = false}) => {

  let slug = params.slug;
  if (!slug) {
    slug = 'index';
  }

  if (!slugPages[slug]) {
    return {
      notFound: true,
    }
  }

  return {
    props: {
      data: {
        title: slugPages[slug].title[locale],
        content: slugPages[slug].content[locale],
        slug: slug,
      },
      preview,
    },
    revalidate: 60,
  }
}

export default SlugPage;