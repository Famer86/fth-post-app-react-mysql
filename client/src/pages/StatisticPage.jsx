import Header from "../components/header/Header.jsx";
import StatisticCard from "../components/statistic/StatisticCard.jsx";
import React, { useEffect, useState } from "react";
import { Area, Pie } from "@ant-design/plots";
import { Spin } from "antd";

const StatisticPage = () => {
  // const [data, setData] = useState([]);
  // spinner çalışması için data yüklenene kadar array gözükmesin ve spin çalışsın
  const [data, setData] = useState();
  const [products, setProducts] = useState([]);
  const user = JSON.parse(localStorage.getItem("posUser"));
  // console.log(user.username);

  useEffect(() => {
    asyncFetch();
  }, []);

  useEffect(() => {
    const getProducts = async () => {
      try {
        const res = await fetch("/api/products");
        const data = await res.json();
        setProducts(data);
      } catch (error) {
        console.log(error);
      }
    };

    getProducts();
  }, []);

  const asyncFetch = () => {
    fetch("/api/bills")
      .then((response) => response.json())
      .then((json) => setData(json))
      .catch((error) => {
        console.log("fetch data failed", error);
      });
  };

  const config = {
    data,
    xField: "customername",
    yField: "subtotal",
    xAxis: {
      range: [0, 1],
    },
  };

  const config2 = {
    appendPadding: 10,
    data,
    angleField: "subtotal",
    colorField: "customername",
    radius: 1,
    innerRadius: 0.6,
    label: {
      text: "subtotal",
      style: {
        fontWeight: "bold",
      },
    },
    legend: {
      color: {
        title: false,
        position: "right",
        rowPadding: 5,
      },
    },
    annotations: [
      {
        type: "text",
        style: {
          text: "Toplam\nDeğer",
          x: "50%",
          y: "50%",
          textAlign: "center",
          fontSize: 40,
          fontStyle: "bold",
        },
      },
    ],
  };

  const totalamount = () => {
    const amount = data.reduce((total, item) => item.totalamount + total, 0);
    return <>{parseFloat(amount).toFixed(2)} ₺</>;
  };

  return (
    <>
      <Header />
      <h1 className="text-4xl font-bold text-center mb-4">İstatistiklerim</h1>
      {data ? (
        <div className="statistic-section">
          <div className="px-6 md:pb-0 pb-20">
            <h2 className="text-lg">
              Hoş geldin{" "}
              <span className="text-green-700 font-bold text-xl">
                {user.username}
              </span>
              .
            </h2>
            <div className="statistic-cards grid xl:grid-cols-4 md:grid-cols-2 my-10 md:gap-10 gap-4">
              <StatisticCard
                text={"Toplam Musteri"}
                amount={data?.length}
                img={"images/user.png"}
              />
              <StatisticCard
                text={"Toplam Kazanç"}
                amount={totalamount()}
                img={"images/money.png"}
              />
              <StatisticCard
                text={"Toplam Satış"}
                amount={data?.length}
                img={"images/sale.png"}
              />
              <StatisticCard
                text={"Toplam Ürün"}
                amount={products?.length}
                img={"images/product.png"}
              />
            </div>

            <div className="flex justify-between gap-10 lg:flex-row flex-col items-center pb-20">
              <div className="lg:w-1/2 lg:h-80 h-72">
                <Area {...config} />
              </div>
              <div className="lg:w-1/2 lg:h-80 h-72">
                <Pie {...config2} />
              </div>
            </div>
          </div>
        </div>
      ) : (
        <Spin
          size="large"
          className="absolute top-1/2 h-screen w-screen flex justify-center"
        />
      )}
    </>
  );
};

export default StatisticPage;
