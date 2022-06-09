import React from 'react'
import { Formik, Form, Field } from 'formik';

const SubscriptionForm = () => {
  const onSubmit = (values, { setSubmitting }) => {
    alert(JSON.stringify(values, null, 2));
    setSubmitting(false);
  }

  return (
    <Formik
      onSubmit={onSubmit}
      initialValues={{ storeName: '', subscriptionPlan: '', cuit: 0, storeAddress: '', cbu: 0 }}>
      {
        ({ isSubmitting }) => (
          <Form className='form' >
            <Field type="text" name="storeName" placeholder="Store Name" />
            <Field type="text" name="subscriptionPlan" placeholder="Subscription Plan" />
            <Field type="number" name="cuit" placeholder="CUIT" />
            <Field type="text" name="storeAddress" placeholder="Store Address" />
            <Field type="number" name="cbu" placeholder="CBU" />
            <button type="submit">Submit</button>
          </Form>
        )
      }
    </Formik>
  )
}

export default SubscriptionForm