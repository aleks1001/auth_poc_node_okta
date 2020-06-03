const GET_USER_BY_EMAIL = `SELECT email, first_name, binary_to_uuid(users.id) AS id,
      image_url, last_name, password, preferred_name, reset_password,
      binary_to_uuid(entity_status.id) AS status_id, entity_status.name AS status_name,
      user_id
      FROM users
      INNER JOIN entity_status ON users.status_id = entity_status.id AND entity_status.is_deleted = 0
      WHERE users.is_deleted = 0
        AND users.email = ?`;

const GET_USER_BY_ID = `SELECT email, first_name, binary_to_uuid(users.id) AS id,
      image_url, last_name, preferred_name, reset_password,
      binary_to_uuid(entity_status.id) AS status_id, entity_status.name AS status_name,
      user_id
      FROM users
      INNER JOIN entity_status ON users.status_id = entity_status.id
      WHERE users.is_deleted = 0
        AND users.id = uuid_to_binary(?)`

module.exports = {
  GET_USER_BY_EMAIL,
  GET_USER_BY_ID,
};
