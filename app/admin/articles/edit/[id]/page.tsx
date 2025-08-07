import EditArticleForm from "@/components/admin/EditArticleForm";

interface Props {
  params: Promise<{ id: string }>;
}

export default async function EditArticlePage({ params }: Props) {
  const resolvedParams = await params;
  return <EditArticleForm articleId={resolvedParams.id} />;
}

