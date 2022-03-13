import { useEffect } from "react";
import { withApollo } from "../utils/withApollo";
import { useRouter } from "next/router";
import { Layout } from "../components/Layout";
import { useMeQuery } from "../generated/graphql";

const Index = () => {
  const { data, loading } = useMeQuery();
  const router = useRouter();
  useEffect(() => {
    if (!loading) {
      if (!data?.me) {
        router.replace("/login?next=" + router.pathname);
      } else {
        if (data.me.isAdmin) {
          // TODO admin path
          // router.replace("/login?next=" + router.pathname);
        } else {
          router.replace("/user/[id]", `/user/${data.me.id}`);
        }
      }
    }
  }, [loading, data, router]);
  return <Layout />;
};

export default withApollo({ ssr: false })(Index);
