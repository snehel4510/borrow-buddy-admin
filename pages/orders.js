import Layout from "@/components/layout";
import {useEffect, useState} from "react";
import axios from "axios";

export default function OrdersPage() {
  const [orders,setOrders] = useState([]);
  useEffect(() => {
    axios.get('/api/orders').then(response => {
      setOrders(response.data);
    });
  }, []);

  return (
    <Layout>
      <h1>Orders</h1>
      <table className="basic">
        <thead>
          <tr>
            <th>Date</th>
            <th>Buyer</th>
            <th>Contact</th>
            <th>Product</th>
          </tr>
        </thead>
        <tbody>
        {orders.length > 0 && orders.map(order => (
          <tr key={order._id}>
            <td>{(new Date(order.createdAt)).toLocaleString()}
            </td>
            {/* <td className={order.paid ? 'text-green-600' : 'text-red-600'}>
              {order.paid ? 'YES' : 'NO'}
            </td> */}
            <td>
              {order.name} {order.year}yr <br />
              {order.branch} {order.enroll}<br />
            </td>
            <td>
                {order.email} <br />
                {order.phone}
            </td>
            <td>
              {/* {order.productInfo.map(l => (
                <>
                  {l.price_data?.product_data.name} x
                  {l.quantity}<br />
                </>
              ))} */}
              {/* {console.log(order.productInfo)} */}
              {order.productInfo[0].title} <br />
              Rs. {order.productInfo[0].price}
            </td>
          </tr>
        ))}
        </tbody>
      </table>
    </Layout>
  );
}