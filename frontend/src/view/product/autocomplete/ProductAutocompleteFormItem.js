import React, { Component } from 'react';
import AutocompleteInMemoryFormItem from 'view/shared/form/items/AutocompleteInMemoryFormItem';
import ProductService from 'modules/product/productService';
import ProductFormModal from 'view/product/form/ProductFormModal';
import { connect } from 'react-redux';
import selectors from 'modules/product/productSelectors';

class ProductAutocompleteFormItem extends Component {
  state = {
    modalVisible: false,
  };

  doCloseModal = () => {
    this.setState({
      modalVisible: false,
    });
  };

  doOpenModal = () => {
    this.setState({
      modalVisible: true,
    });
  };

  doCreateSuccess = (record) => {
    const { form, name, mode } = this.props;

    if (mode && mode === 'multiple') {
      form.setFieldValue(name, [
        ...(form.values[name] || []),
        record,
      ]);
    } else {
      form.setFieldValue(name, record);
    }

    this.doCloseModal();
  };

  fetchFn = (value, limit) => {
    return ProductService.listAutocomplete(value, limit);
  };

  mapper = {
    toAutocomplete(originalValue) {
      if (!originalValue) {
        return undefined;
      }

      const value = originalValue.id;
      let label = originalValue.label;

      if (originalValue['name']) {
        label = originalValue['name'];
      }

      return {
        key: value,
        value,
        label,
      };
    },

    toValue(originalValue) {
      if (!originalValue) {
        return undefined;
      }

      return {
        id: originalValue.value,
        label: originalValue.label,
      };
    },
  };

  render() {
    const { form, ...rest } = this.props;

    return (
      <React.Fragment>
        <AutocompleteInMemoryFormItem
          {...rest}
          fetchFn={this.fetchFn}
          mapper={this.mapper}
          onOpenModal={this.doOpenModal}
        />

        {this.state.modalVisible && (
          <ProductFormModal
            onClose={this.doCloseModal}
            onSuccess={this.doCreateSuccess}
          />
        )}
      </React.Fragment>
    );
  }
}

const select = (state) => ({
  hasPermissionToCreate: selectors.selectPermissionToCreate(
    state,
  ),
});

export default connect(select)(
  ProductAutocompleteFormItem,
);