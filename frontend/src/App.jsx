import { WikiLayout } from '@/pages/wiki-layout';
import { WikiArticle } from '@/pages/wiki-article';

export default function HomePage() {
  return (
    <WikiLayout>
      <WikiArticle />
    </WikiLayout>
  );
}
