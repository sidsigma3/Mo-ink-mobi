import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Modal } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import HomeIcon from 'react-native-vector-icons/Feather';
import WorkIcon from 'react-native-vector-icons/MaterialCommunityIcons';
import OtherIcon from 'react-native-vector-icons/MaterialCommunityIcons';
import ModalAddressDelete from '../Modal/ModalAddressDelete';

const AddressBox = ({ address, name, company, phone, onDelete }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const openModal = (e) => {
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
  };

  const confirmDelete = () => {
    onDelete();
    setIsModalOpen(false);
  };

  const renderAddressIcon = () => {
    if (address.addressType === 'HOME') {
      return <HomeIcon name="home" size={18} color="#6B21A8" />;
    } else if (address.addressType === 'WORK') {
      return <WorkIcon name="briefcase" size={18} color="#6B21A8" />;
    } else {
      return <OtherIcon name="office-building" size={18} color="#6B21A8" />;
    }
  };

  return (
    <TouchableOpacity style={styles.container} activeOpacity={0.8}>
      <View style={styles.leftColumn}>
        <View style={styles.headerRow}>
          <Text style={styles.name}>{name}</Text>

          <View style={styles.addressTypeTag}>
            {renderAddressIcon()}
            <Text style={styles.addressTypeText}>{address.addressType}</Text>
          </View>

          {address?.addressType !== 'HOME' && (
            <TouchableOpacity
              onPress={openModal}
              style={styles.deleteButton}
            >
              <Icon name="delete-outline" size={18} color="#B91C1C" />
              <Text style={styles.deleteText}>DELETE</Text>
            </TouchableOpacity>
          )}
        </View>

        {company ? <Text style={styles.company}>{company}</Text> : null}
        <Text style={styles.addressLine}>{address.street}</Text>
        <Text style={styles.addressLine}>
          {address.city} - {address.zipcode}
        </Text>
        <Text style={styles.addressLine}>{address.state}</Text>
        <Text style={styles.addressLine}>Mobile: {phone}</Text>
      </View>

      <View style={styles.arrowContainer}>
        <Icon name="arrow-forward-ios" size={20} color="#9CA3AF" />
      </View>

      {/* Modal for delete confirmation */}
      <Modal
        visible={isModalOpen}
        transparent
        animationType="fade"
        onRequestClose={closeModal}
      >
        <ModalAddressDelete
          onCancel={closeModal}
          onConfirm={confirmDelete}
        />
      </Modal>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    borderWidth: 1,
    borderColor: '#E5E7EB',
    borderRadius: 8,
    padding: 12,
    marginBottom: 10,
    backgroundColor: '#FFFFFF',
    alignItems: 'center',
  },
  leftColumn: {
    flex: 1,
  },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 6,
    flexWrap: 'wrap',
  },
  name: {
    fontSize: 16,
    fontWeight: 'bold',
    marginRight: 8,
  },
  addressTypeTag: {
    flexDirection: 'row',
    alignItems: 'center',
    borderColor: '#6B21A8',
    borderWidth: 1,
    borderRadius: 20,
    paddingHorizontal: 8,
    paddingVertical: 4,
    marginRight: 8,
  },
  addressTypeText: {
    color: '#6B21A8',
    fontWeight: '600',
    marginLeft: 4,
  },
  deleteButton: {
    flexDirection: 'row',
    alignItems: 'center',
    borderColor: '#B91C1C',
    borderWidth: 1,
    borderRadius: 20,
    paddingHorizontal: 8,
    paddingVertical: 4,
  },
  deleteText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#B91C1C',
    marginLeft: 4,
  },
  company: {
    fontWeight: '500',
    color: '#6B7280',
  },
  addressLine: {
    fontWeight: '500',
    color: '#6B7280',
    marginTop: 2,
  },
  arrowContainer: {
    marginLeft: 8,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default AddressBox;
