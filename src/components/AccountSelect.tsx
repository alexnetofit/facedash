'use client';

import { Switch } from '@headlessui/react';

type Account = {
  id: string;
  nome_conta: string;
  ad_account_id: string;
  selecionada: boolean;
};

type AccountSelectProps = {
  accounts: Account[];
  onToggle: (accountId: string, selected: boolean) => Promise<void>;
  isLoading?: boolean;
};

export default function AccountSelect({ accounts, onToggle, isLoading = false }: AccountSelectProps) {
  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm">
      <div className="p-4 border-b dark:border-gray-700">
        <h2 className="text-lg font-medium text-gray-900 dark:text-white">Contas de Anúncios</h2>
        <p className="text-sm text-gray-500 dark:text-gray-400">Selecione as contas que deseja monitorar.</p>
      </div>
      <div className="p-4">
        {accounts.length === 0 ? (
          <p className="text-gray-500 dark:text-gray-400">Nenhuma conta de anúncios disponível.</p>
        ) : (
          <ul className="divide-y dark:divide-gray-700">
            {accounts.map((account) => (
              <li key={account.id} className="py-4 flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-900 dark:text-white">{account.nome_conta}</p>
                  <p className="text-xs text-gray-500 dark:text-gray-400">ID: {account.ad_account_id}</p>
                </div>
                <Switch
                  checked={account.selecionada}
                  onChange={(checked) => onToggle(account.id, checked)}
                  disabled={isLoading}
                  className={`${
                    account.selecionada ? 'bg-blue-600' : 'bg-gray-300 dark:bg-gray-600'
                  } relative inline-flex h-6 w-11 items-center rounded-full transition-colors`}
                >
                  <span className="sr-only">Ativar conta</span>
                  <span
                    className={`${
                      account.selecionada ? 'translate-x-6' : 'translate-x-1'
                    } inline-block h-4 w-4 transform rounded-full bg-white transition-transform`}
                  />
                </Switch>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
} 