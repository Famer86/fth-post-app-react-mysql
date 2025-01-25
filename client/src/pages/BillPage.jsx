import { Button, Spin, Table } from "antd";
import { useEffect, useState } from "react";
import PrintBill from "../components/bills/PrintBill.jsx";
import Header from "../components/header/Header.jsx";

const BillPage = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [billItems, setBillItems] = useState();
  const [customer, setCustomer] = useState();
  // console.log(customer);
  // console.log(billItems);

  useEffect(() => {
    const getBills = async () => {
      try {
        const res = await fetch(process.env.REACT_APP_CLIENT_SERVER + "/api/bills");
        const data = await res.json();
        setBillItems(data);
      } catch (error) {
        console.log(error);
      }
    };
    getBills();
  }, []);

  const columns = [
    {
      title: "Müşteri Adı",
      dataIndex: "customername",
      key: "customername",
    },
    {
      title: "Telefon Numarası",
      dataIndex: "customerphonenumber",
      key: "customerphonenumber",
    },
    {
      title: "Oluşturma Tarihi",
      dataIndex: "timestamps",
      key: "timestamps",
      render: (text) => {
        return <span>{text}</span>;
      },
    },
    {
      title: "Ödeme Yöntemi",
      dataIndex: "paymentmode",
      key: "paymentmode",
    },
    {
      title: "Toplam Fiyat",
      dataIndex: "totalamount",
      key: "totalamount",
      render: (text) => {
        return <span> {text}₺</span>;
      },
    },
    {
      title: "Actions",
      dataIndex: "action",
      key: "action",
      render: (_, record) => {
        return (
          <Button
            type="text"
            className="pl-0"
            onClick={() => {
              setIsModalOpen(true);
              setCustomer(record);
            }}
          >
            Yazdir
          </Button>
        );
      },
    },
  ];
  // console.log(isModalOpen);
  return (
    <>
      <Header />
      <h1 className="text-4xl font-bold text-center mb-4">Faturalar</h1>
      {billItems ? (
        <div className="px-6">
          <Table
            dataSource={billItems}
            columns={columns}
            bordered
            pagination={false}
            scroll={{
              x: 1000,
              y: 300,
            }}
            rowKey={"id"}
          />
        </div>
      ) : (
        <Spin
          size="large"
          className="absolute top-1/2 h-screen w-screen flex justify-center"
        />
      )}

      <PrintBill
        isModalOpen={isModalOpen}
        setIsModalOpen={setIsModalOpen}
        customer={customer}
      />
    </>
  );
};
export default BillPage;
