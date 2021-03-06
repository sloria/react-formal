import { mount } from 'enzyme'
import React from 'react'
import * as yup from 'yup'

import Form from '../src'
import errorManager from '../src/errorManager'
import NestedForm from '../src/NestedForm'

describe('NestedForm', () => {
  let attachTo
  let schema = yup.object({
    name: yup.object({
      first: yup.string().default(''),
      last: yup.string().default(''),
    }),
  })

  it('should work', () => {
    let value, last
    let change = sinon.spy(v => (value = v))

    let wrapper = mount(
      <Form
        schema={schema}
        defaultValue={schema.default()}
        onChange={change}
        // __debugName="outer"
      >
        <div>
          <NestedForm as="div" name="name">
            <Form.Field name="first" className="field" />
            <Form.Field name="last" className="field" />
          </NestedForm>
        </div>
      </Form>
    )

    wrapper
      .find('.field')
      .first()
      .simulate('change', { target: { value: 'Jill' } })

    change.should.have.been.calledOnce()

    value.should.eql({
      name: {
        first: 'Jill',
        last: '',
      },
    })

    last = value

    wrapper
      .find('.field')
      .last()
      .simulate('change', { target: { value: 'Smith' } })

    value.should.eql({
      name: {
        first: 'Jill',
        last: 'Smith',
      },
    })

    value.should.not.equal(last)
  })
})
