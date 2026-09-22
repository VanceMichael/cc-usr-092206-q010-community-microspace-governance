import test from 'node:test';
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import { parseDomain } from '../src/domain.js';

const load = async () => parseDomain(
  await readFile(new URL('../fixtures/domain.json', import.meta.url), 'utf8')
);

test('样例领域标识正确', async () => {
  const value = await load();
  assert.equal(value.domain, 'community-microspace-governance');
  assert.ok(value.constraints.length >= 2);
});

test('参与方带标识与角色', async () => {
  const value = await load();
  const ids = value.actors.map((a) => a.id);
  assert.deepEqual(ids, ['resident', 'street-office', 'co-builder', 'operator']);
  assert.ok(value.actors.every((a) => a.roles.length > 0));
});

test('运营四件事在同一项目下运转', async () => {
  const value = await load();
  assert.deepEqual(value.operating_matters, [
    '场地预约（如门球场开放时段）',
    '志愿排班（如早餐点值守）',
    '设施报修',
    '公益回馈登记与核对'
  ]);
});

test('变更事件必须留痕旧约定并通知受影响者', async () => {
  const value = await load();
  for (const event of ['功能调整', '临时关闭', '噪声纠纷处置', '合作商户退出', '认领人变更']) {
    assert.ok(value.change_events.includes(event), `缺少变更事件：${event}`);
  }
  assert.ok(value.change_rules.some((r) => r.includes('保存此前约定')));
  assert.ok(value.change_rules.some((r) => r.includes('通知实际受影响者')));
});

test('诉求隐私边界：内容仅承办人员可见，进度公开', async () => {
  const value = await load();
  assert.ok(value.information_access.some((r) => r.includes('个人诉求内容仅向承办人员开放')));
  assert.ok(value.information_access.some((r) => r.includes('处理进度向居民公开')));
});

test('街道按四个维度复核是否符合最初协商结果', async () => {
  const value = await load();
  assert.deepEqual(value.review_dimensions, ['服务人群', '使用情况', '维修结果', '收益去向']);
});

test('缺少必填字段时解析失败', () => {
  assert.throws(() => parseDomain(JSON.stringify({ domain: 'x' })), /必要字段/);
});
