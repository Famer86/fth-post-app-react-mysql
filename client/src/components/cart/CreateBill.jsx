import { Button, Card, Form, Input, Modal, Select, message } from "antd";
import { useDispatch, useSelector } from "react-redux";
import { reset } from "../../redux/cartSlice";
import { useNavigate } from "react-router-dom";

const CreateBill = ({ isModalOpen, setIsModalOpen }) => {
  const cart = useSelector((state) => state.cart);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const onFinish = async (values) => {
    try {
      const res = await fetch(process.env.REACT_APP_CLIENT_SERVER + "/api/bills/add", {
        method: "POST",
        body: JSON.stringify({
          ...values, //customername, customerphonenumber, paymentmode
          cartitems: JSON.stringify(cart.cartItems),
          subtotal: cart.total,
          tax: ((cart.total * cart.tax) / 100).toFixed(2),
          totalamount: (cart.total + (cart.total * cart.tax) / 100).toFixed(2),
        }),
        headers: { "Content-type": "application/json; charset=UTF-8" },
      });
      if (res.status === 200) {
        message.success("Fatura başarıyla oluşturuldu.");
        dispatch(reset());
        navigate("/bills");
      }
    } catch (error) {
      message.danger("Bir seyler yanlis gitti");
    }
  };

  return (
    <Modal
      title="Fatura Oluştur"
      open={isModalOpen}
      footer={false}
      onCancel={() => setIsModalOpen(false)}
    >
      <Form layout={"vertical"} onFinish={onFinish}>
        <Form.Item
          label="Müşteri Adı"
          name={"customername"}
          rules={[
            {
              required: true,
              message: "Username is required",
            },
          ]}
        >
          <Input placeholder="Bir Müşteri Adi Yaziniz" />
        </Form.Item>
        <Form.Item
          rules={[{ required: true }]}
          name={"customerphonenumber"}
          label="Tel No"
        >
          <Input placeholder="Bir Tel No Yaziniz" maxLength={11} />
        </Form.Item>
        <Form.Item
          label="Ödeme Yöntemi"
          rules={[{ required: true }]}
          name={"paymentmode"}
        >
          <Select placeholder="Bir Ödeme Yöntemi Seçiniz">
            <Select.Option value="Nakit">Nakit</Select.Option>
            <Select.Option value="Kredi Kartı">Kredi Kartı</Select.Option>
          </Select>
        </Form.Item>
        <Card>
          <div className="flex justify-between">
            <span>Ara Toplam</span>
            <span>{cart.total.toFixed(2)}₺</span>
          </div>
          <div className="flex justify-between my-2">
            <span>KDV Toplam %{cart.tax}</span>
            <span className="text-red-600">
              {((cart.total * cart.tax) / 100).toFixed(2) > 0
                ? `+${((cart.total * cart.tax) / 100).toFixed(2)}`
                : `0.00`}
              ₺
            </span>
          </div>
          <div className="flex justify-between">
            <b>Toplam</b>
            <b>{((cart.total * cart.tax) / 100 + cart.total).toFixed(2)}₺</b>
          </div>
          <div className="flex justify-end">
            <Button
              className="mt-4"
              type="primary"
              onClick={() => setIsModalOpen(true)}
              htmlType="submit"
            >
              Sipariş Oluştur
            </Button>
          </div>
        </Card>
      </Form>
    </Modal>
  );
};

export default CreateBill;
