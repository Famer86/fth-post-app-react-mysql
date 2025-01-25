import { Button, Form, Input, Modal, Select, Table, message } from "antd";
import React, { useEffect, useState } from "react";

const Edit = () => {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState({});
  const [form] = Form.useForm();

  useEffect(() => {
    const getProducts = async () => {
      try {
        const res = await fetch(process.env.REACT_APP_CLIENT_SERVER + "/api/products/");
        const data = await res.json();
        setProducts(data);
      } catch (error) {
        console.log(error);
      }
    };
    getProducts();
  }, []);

  useEffect(() => {
    const getCategories = async () => {
      try {
        const res = await fetch(process.env.REACT_APP_CLIENT_SERVER + "/api/categories/");
        const data = await res.json();
        data &&
          setCategories(
            data.map((item) => {
              return { ...item, value: item.title };
            })
          );
      } catch (error) {
        console.log(error);
      }
    };

    getCategories();
  }, []);

  const onFinish = (values) => {
    // console.log(values);
    try {
      fetch(process.env.REACT_APP_CLIENT_SERVER + "/api/products/update/" + [editingItem.id], {
        method: "PUT",
        body: JSON.stringify({ ...values }),
        headers: { "Content-type": "application/json; charset=UTF-8" },
      });
      message.success("Ürün başarıyla güncellendi.");
      //item.id ile editingRow.id si eşit olanın title 'nı döndür.
      setProducts(
        products.map((item) => {
          if (item.id === editingItem.id) {
            return values;
          }
          return item;
        })
      );
      setIsEditModalOpen(false)
    } catch (error) {
      message.error("Bir seyler yanlis gitti");
      console.log(error);
    }
  };

  const deleteProduct = (id) => {
    if (window.confirm("Emin Misin ?")) {
      try {
        fetch(process.env.REACT_APP_CLIENT_SERVER + "/api/products/delete/" + [id], {
          method: "DELETE",
          headers: { "Content-type": "application/json; charset=UTF-8" },
        });
        message.success("Ürün basariyla silindi");
        setProducts(products.filter((item) => item.id !== id));
      } catch (error) {
        message.error("Bir seyler yanlis gitti");
        console.log(error);
      }
    }
  };

  const columns = [
    {
      title: "Ürün Adı",
      dataIndex: "title",
      width: "8%",
      render: (_, record) => {
        return <p>{record.title}</p>;
      },
    },
    {
      title: "Ürün Görseli",
      dataIndex: "img",
      width: "4%",
      render: (_, record) => {
        return (
          <img src={record.img} alt="" className="w-full h-20 object-cover" />
        );
      },
    },
    {
      title: "Fiyatı",
      dataIndex: "price",
      width: "8%",
    },
    {
      title: "Kategori",
      dataIndex: "category",
      width: "8%",
    },
    {
      title: "Action",
      dataIndex: "action",
      width: "8%",
      render: (_, record) => {
        return (
          <div>
            <Button
              type="text"
              className="pl-0"
              onClick={() => {
                setIsEditModalOpen(true);
                setEditingItem(record);
              }}
            >
              Duzenle
            </Button>
            <Button
              type="text"
              danger
              onClick={() => deleteProduct(record.id)}
            >
              sil
            </Button>
          </div>
        );
      },
    },
  ];
  return (
    <>
      <Form onFinish={onFinish}>
        <Table
          bordered
          columns={columns}
          dataSource={products}
          rowKey={"id"}
          scroll={{
            x: 1000,
            y: 600,
          }}
        />
      </Form>

      <Modal
        title="Yeni Ürün Ekle"
        open={isEditModalOpen}
        onCancel={() => setIsEditModalOpen(false)}
        footer={false}
      >
        <Form
          layout="vertical"
          onFinish={onFinish}
          form={form}
          initialValues={editingItem} //Form item alanlarına editingItem içerisindeki tüm verilerin gelmesi için
        >
          <Form.Item
            name="title"
            label="Ürün Adı Ekle"
            rules={[
              { required: true, message: "Ürün Adı Alanı Boş Geçilemez!" },
            ]}
          >
            <Input placeholder="Ürün adı griniz" />
          </Form.Item>
          <Form.Item
            name="img"
            label="Ürün Resmi Ekle"
            rules={[
              { required: true, message: "Ürün Resmi Alanı Boş Geçilemez!" },
            ]}
          >
            <Input placeholder="Ürün resmi ekleyiniz" />
          </Form.Item>
          <Form.Item
            name="price"
            label="Ürün fiyatı Ekle"
            rules={[
              { required: true, message: "Ürün fiyatı Alanı Boş Geçilemez!" },
            ]}
          >
            <Input placeholder="Ürün fiyatı giriniz" />
          </Form.Item>
          <Form.Item
            name="category"
            label="Kategorisi Sec"
            rules={[
              { required: true, message: "Kategori Alanı Boş Geçilemez!" },
            ]}
          >
            <Select
              showSearch
              placeholder="Search to Select"
              optionFilterProp="title"
              filterSort={(optionA, optionB) =>
                (optionA?.title ?? "")
                  .toLowerCase()
                  .localeCompare((optionB?.title ?? "").toLowerCase())
              }
              options={categories}
            />
          </Form.Item>
          <Form.Item className="flex justify-end mb-0">
            <Button type="primary" htmlType="submit">
              Oluştur
            </Button>
          </Form.Item>
        </Form>
      </Modal>
    </>
  );
};

export default Edit;
