// 读取并检查项目共享的领域资料。
function requireStringList(value, field, min) {
  if (!Array.isArray(value) || value.length < min ||
    value.some((item) => typeof item !== 'string' || item.length === 0)) {
    throw new Error(`共享资料字段 ${field} 必须是至少 ${min} 条非空字符串`);
  }
}

export function parseDomain(raw) {
  const value = JSON.parse(raw);
  if (!value.domain || !value.version || !value.sample_id) {
    throw new Error('共享资料缺少必要字段');
  }
  if (!Array.isArray(value.actors) || value.actors.length < 2 ||
    value.actors.some((actor) => !actor || !actor.id || !actor.name ||
      !Array.isArray(actor.roles) || actor.roles.length === 0)) {
    throw new Error('共享资料字段 actors 必须包含标识、名称和承担角色');
  }
  requireStringList(value.lifecycle_stages, 'lifecycle_stages', 2);
  requireStringList(value.facts, 'facts', 2);
  requireStringList(value.operating_matters, 'operating_matters', 1);
  requireStringList(value.change_events, 'change_events', 1);
  requireStringList(value.change_rules, 'change_rules', 1);
  requireStringList(value.information_access, 'information_access', 1);
  requireStringList(value.review_dimensions, 'review_dimensions', 1);
  requireStringList(value.constraints, 'constraints', 2);
  return value;
}
