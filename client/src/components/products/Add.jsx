import { Button, Form, Input, Modal, Select, message } from "antd";
import React from "react";

const Add = ({
  isAddModalOpen,
  setIsAddModalOpen,
  categories,
  products,
  setProducts,
}) => {
  const [form] = Form.useForm();

  const onFinish = (values) => {
    try {
      fetch(process.env.REACT_APP_CLIENT_SERVER + "/api/products/add", {
        method: "POST",
        body: JSON.stringify(values),
        headers: { "Content-type": "application/json; charset=UTF-8" },
      });
      message.success("Ürün başariyla eklendi.");
      form.resetFields();
      setIsAddModalOpen(false);
      //tüm ürünleri al (...products) value leri dağıt
      setProducts([
        ...products,
        {
          ...values,
          id: Math.random(), //unique key istediği iiçn colsole da hata vermemesi için
          price: Number(values.price),
        },
      ]);
    } catch (error) {
      console.log(error);
    }
  };
  return (
    <Modal
      title="Yeni Ürün Ekle"
      open={isAddModalOpen}
      onCancel={() => setIsAddModalOpen(false)}
      footer={false}
    >
      <Form layout="vertical" onFinish={onFinish} form={form}>
        <Form.Item
          name="title"
          label="Ürün Adı Ekle"
          rules={[{ required: true, message: "Ürün Adı Alanı Boş Geçilemez!" }]}
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
          rules={[{ required: true, message: "Kategori Alanı Boş Geçilemez!" }]}
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
  );
};

export default Add;
