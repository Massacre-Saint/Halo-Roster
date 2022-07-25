import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import FloatingLabel from 'react-bootstrap/FloatingLabel';
import Form from 'react-bootstrap/Form';
import { Button } from 'react-bootstrap';
import { createPlayer, updatePlayer } from '../../api/playerData';
import { useAuth } from '../../utils/context/authContext';

const intitialState = {
  gamertag: '',
  imageUrl: '',
  level: '',
};

export default function PlayerForm({ obj }) {
  const [formInput, setFormInput] = useState(intitialState);
  const router = useRouter();
  const { user } = useAuth();

  useEffect(() => {
    if (obj.firebaseKey) setFormInput(obj);
  }, [obj, user]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormInput((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (obj.firebaseKey) {
      updatePlayer(formInput)
        .then(() => router.push('/players'));
    } else {
      const payload = { ...formInput, uid: user.uid };
      createPlayer(payload).then(() => {
        router.push('/players');
      });
    }
  };

  return (
    <Form onSubmit={handleSubmit}>
      <h2 className="text-white mt-5">{obj.firebaseKey ? 'Update' : 'Create'} Player</h2>
      <FloatingLabel controlId="floatingInput1" label="Gamertag" className="mb-3">
        <Form.Control type="text" placeholder="Gamertag" name="gamertag" value={formInput.gamertag} onChange={handleChange} required />
      </FloatingLabel>
      <FloatingLabel controlId="floatingInput2" label="Spartan Image" className="mb-3">
        <Form.Control type="url" placeholder="Enter an image url" name="image" value={formInput.image} onChange={handleChange} required />
      </FloatingLabel>
      <FloatingLabel controlId="floatingInput1" label="Ranking" className="mb-3">
        <Form.Control type="text" placeholder="Spartan Ranking" name="level" value={formInput.level} onChange={handleChange} required />
      </FloatingLabel>
      <Button type="submit">{obj.firebaseKey ? 'Update' : 'Create'} Player</Button>
    </Form>
  );
}

PlayerForm.propTypes = {
  obj: PropTypes.shape({
    firebaseKey: PropTypes.string,
    gamertag: PropTypes.string,
    level: PropTypes.string,
    image: PropTypes.string,
  }),
};

PlayerForm.defaultProps = {
  obj: intitialState,
};