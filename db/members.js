const members = new Map();

module.exports = {
  getAll: () => Array.from(members.values()),
  getByLineId: (lineId) => [...members.values()].find((m) => m.lineId === lineId),
  add: (member) => members.set(member.memberId, member),
  update: (member) => members.set(member.memberId, member),
  exists: (lineId) => !![...members.values()].find((m) => m.lineId === lineId),
};
