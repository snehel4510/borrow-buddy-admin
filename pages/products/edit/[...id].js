import Layout from "@/components/layout";
import {useRouter} from "next/router";
import {useEffect, useState} from "react";
import axios from "axios";
import ProductForm from "@/components/productForm";

export default function EditProductPage() {

  const [productInfo, setProductInfo] = useState(null);
  const router = useRouter();
  const {id} = router.query;

  useEffect(() => {
    console.log(id);
    if (!id) {
      return;
    }
    axios.get('/api/products?id='+id).then(response => {
      setProductInfo(response.data);
    });
  }, [id]);

  return (
    <Layout>
      <h1>Edit product</h1>
      {productInfo && (
        <ProductForm {...productInfo} />
      )}
    </Layout>
  );
}